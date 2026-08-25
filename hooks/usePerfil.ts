"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

const CLAVE_LOCAL = "erudito-perfil";

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
        setPerfil(raw ? (JSON.parse(raw) as DatosPerfil) : null);
      } catch {
        setPerfil(null);
      }
      setListo(true);
      return;
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
        localStorage.setItem(CLAVE_LOCAL, JSON.stringify(nuevo));
      }

      setPerfil(nuevo);
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
        }
      } else {
        localStorage.setItem(CLAVE_LOCAL, JSON.stringify(final));
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
        }
      }

      setPerfil({ ...final });
    },
    [user]
  );

  const cerrarSesion = useCallback(async () => {
    localStorage.removeItem(CLAVE_LOCAL);
    setPerfil(null);
    await supabase.auth.signOut();
    window.dispatchEvent(new Event("erudito-sesion-cerrada"));
  }, []);

  return { perfil, listo, elegirRol, guardar, cerrarSesion };
}
