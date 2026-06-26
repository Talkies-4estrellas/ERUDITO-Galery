"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

const CLAVE_LOCAL = "erudito-perfil";

export type Rol = "artista" | "comprador" | "empresa";

export interface DatosPerfil {
  rol: Rol;
  nombre: string;
  bio: string;
  especialidad: string;
  pais: string;
  email?: string;
  slug?: string;
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
        slug: rol === "empresa" ? "mi-galeria" : undefined,
      };

      if (user) {
        await supabase.from("perfiles").upsert({
          id: user.id,
          rol,
          nombre: "",
          bio: "",
          especialidad: "",
          pais: "",
          slug: rol === "empresa" ? "mi-galeria" : null,
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
          datos.rol === "empresa"
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
        });
      } else {
        localStorage.setItem(CLAVE_LOCAL, JSON.stringify(final));
      }

      setPerfil({ ...final });
    },
    [user]
  );

  const cerrarSesion = useCallback(() => {
    localStorage.removeItem(CLAVE_LOCAL);
    setPerfil(null);
  }, []);

  return { perfil, listo, elegirRol, guardar, cerrarSesion };
}
