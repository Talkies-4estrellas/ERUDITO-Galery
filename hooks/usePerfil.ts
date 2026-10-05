"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

const CLAVE_LOCAL = "erudito-perfil";
const EVENTO_PERFIL = "erudito-perfil-actualizado";
const EXPIRACION_MS = 7 * 24 * 60 * 60 * 1000; // 7 días

function emitirPerfil(datos: DatosPerfil | null) {
  window.dispatchEvent(new CustomEvent(EVENTO_PERFIL, { detail: datos }));
}

export type Rol = "artista" | "comprador" | "empresa" | "admin" | "productor";

export interface DatosPerfil {
  rol: Rol;
  nombre: string;
  bio: string;
  especialidad: string;
  pais: string;
  email?: string;
  slug?: string;
  avatar_url?: string;
  banner_url?: string;
  estado?: "pendiente" | "aprobado";
}

export function generarSlug(nombre: string): string {
  return (
    nombre
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 50) || "mi-galeria"
  );
}

const VACIO: DatosPerfil = {
  rol: "artista",
  nombre: "",
  bio: "",
  especialidad: "",
  pais: "",
};

export function usePerfil() {
  const { user } = useAuth();
  const [perfil, setPerfil] = useState<DatosPerfil | null>(null);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    if (!user) {
      try {
        const raw = localStorage.getItem(CLAVE_LOCAL);
        if (raw) {
          const parsed = JSON.parse(raw) as DatosPerfil & { _savedAt?: number };
          if (!parsed._savedAt || Date.now() - parsed._savedAt > EXPIRACION_MS) {
            localStorage.removeItem(CLAVE_LOCAL);
            setPerfil(null);
          } else {
            const { _savedAt: _, ...datos } = parsed;
            setPerfil(datos as DatosPerfil);
          }
        } else {
          setPerfil(null);
        }
      } catch {
        setPerfil(null);
      }
      setListo(true);

      // Sincroniza con otras instancias del hook en la misma página
      function onActualizado(e: Event) {
        setPerfil((e as CustomEvent<DatosPerfil | null>).detail);
      }
      window.addEventListener(EVENTO_PERFIL, onActualizado);
      return () => window.removeEventListener(EVENTO_PERFIL, onActualizado);
    }

    supabase
      .from("perfiles")
      .select("*")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setPerfil({
            rol: data.rol as Rol,
            nombre: data.nombre ?? "",
            bio: data.bio ?? "",
            especialidad: data.especialidad ?? "",
            pais: data.pais ?? "",
            email: user.email ?? undefined,
            slug: data.slug ?? undefined,
            avatar_url: data.avatar_url ?? "",
            banner_url: data.banner_url ?? "",
          });
        } else {
          setPerfil(null);
        }
        setListo(true);
      });
  }, [user]);

  const elegirRol = useCallback(
    async (rol: Rol, email?: string) => {
      const nuevo: DatosPerfil = {
        ...VACIO,
        rol,
        email: email ?? undefined,
        slug: rol === "empresa" ? "mi-galeria" : rol === "artista" || rol === "productor" ? "mi-perfil" : undefined,
      };

      if (user) {
        await supabase.from("perfiles").upsert({
          id: user.id,
          rol,
          nombre: "",
          bio: "",
          especialidad: "",
          pais: "",
          slug: rol === "empresa" ? "mi-galeria" : rol === "artista" || rol === "productor" ? "mi-perfil" : null,
        });
      } else {
        localStorage.setItem(CLAVE_LOCAL, JSON.stringify({ ...nuevo, _savedAt: Date.now() }));
      }

      setPerfil(nuevo);
      emitirPerfil(nuevo);
    },
    [user]
  );

  const guardar = useCallback(
    async (datos: DatosPerfil) => {
      const final: DatosPerfil = {
        ...datos,
        slug:
          datos.rol === "empresa" || datos.rol === "artista" || datos.rol === "productor"
            ? datos.slug || generarSlug(datos.nombre)
            : undefined,
      };

      if (user) {
        await supabase.from("perfiles").upsert({
          id: user.id,
          rol: final.rol,
          nombre: final.nombre,
          bio: final.bio,
          especialidad: final.especialidad,
          pais: final.pais,
          slug: final.slug ?? null,
          avatar_url: final.avatar_url ?? "",
          banner_url: final.banner_url ?? "",
        });
        // Sincroniza con usuarios para que el perfil público sea visible
        if (user.email && (final.rol === "artista" || final.rol === "empresa" || final.rol === "productor")) {
          await supabase.from("usuarios").upsert({
            email: user.email,
            clave: "supabase-auth",
            nombre: final.nombre,
            bio: final.bio,
            especialidad: final.especialidad,
            pais: final.pais,
            rol: final.rol,
            slug: final.slug ?? null,
            avatar_url: final.avatar_url ?? null,
            banner_url: final.banner_url ?? null,
          }, { onConflict: "email" });
          // Mantiene avatar y nombre en las obras del artista sincronizados
          if (final.rol === "artista") {
            await supabase.from("obras")
              .update({ avatar_artista: final.avatar_url ?? null, nombre_artista: final.nombre })
              .eq("artista_email", user.email);
            // También sincroniza obras seeded enlazadas por id_artista (tabla artistas)
            const { data: ar } = await supabase
              .from("artistas").select("id_artista").eq("nombre", final.nombre).maybeSingle();
            if (ar?.id_artista) {
              await supabase.from("obras")
                .update({ avatar_artista: final.avatar_url ?? null })
                .eq("id_artista", ar.id_artista);
            }
          }
        }
      } else {
        localStorage.setItem(CLAVE_LOCAL, JSON.stringify({ ...final, _savedAt: Date.now() }));
        // Sincroniza con tabla usuarios para que el perfil público sea visible
        if (final.email && (final.rol === "artista" || final.rol === "empresa" || final.rol === "productor")) {
          await supabase.from("usuarios").update({
            nombre: final.nombre,
            bio: final.bio,
            especialidad: final.especialidad,
            pais: final.pais,
            slug: final.slug ?? null,
            avatar_url: final.avatar_url ?? null,
            banner_url: final.banner_url ?? null,
          }).eq("email", final.email);
          // Mantiene avatar y nombre en las obras del artista sincronizados
          if (final.rol === "artista") {
            await supabase.from("obras")
              .update({ avatar_artista: final.avatar_url ?? null, nombre_artista: final.nombre })
              .eq("artista_email", final.email);
            // También sincroniza obras seeded enlazadas por id_artista (tabla artistas)
            const { data: ar } = await supabase
              .from("artistas").select("id_artista").eq("nombre", final.nombre).maybeSingle();
            if (ar?.id_artista) {
              await supabase.from("obras")
                .update({ avatar_artista: final.avatar_url ?? null })
                .eq("id_artista", ar.id_artista);
            }
          }
        }
      }

      setPerfil({ ...final });
      emitirPerfil({ ...final });
    },
    [user]
  );

  const cerrarSesion = useCallback(async () => {
    localStorage.removeItem(CLAVE_LOCAL);
    setPerfil(null);
    emitirPerfil(null);
    await supabase.auth.signOut();
    window.dispatchEvent(new Event("erudito-sesion-cerrada"));
  }, []);

  return { perfil, listo, elegirRol, guardar, cerrarSesion };
}
