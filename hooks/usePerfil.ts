"use client";

import { useCallback, useEffect, useState } from "react";

const CLAVE = "erudito-perfil";

export type Rol = "artista" | "comprador" | "empresa";

export interface DatosPerfil {
  rol: Rol;
  nombre: string;
  bio: string;
  especialidad: string;
  pais: string;
  /** Slug único para la URL pública de la empresa (solo rol "empresa") */
  slug?: string;
}

export function generarSlug(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 50) || "mi-galeria";
}

const VACIO: DatosPerfil = {
  rol: "artista",
  nombre: "",
  bio: "",
  especialidad: "",
  pais: "",
};

function leer(): DatosPerfil | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CLAVE);
    return raw ? (JSON.parse(raw) as DatosPerfil) : null;
  } catch {
    return null;
  }
}

export function usePerfil() {
  const [perfil, setPerfil] = useState<DatosPerfil | null>(null);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    setPerfil(leer());
    setListo(true);
  }, []);

  const elegirRol = useCallback((rol: Rol) => {
    const nuevo: DatosPerfil = {
      ...VACIO,
      rol,
      slug: rol === "empresa" ? "mi-galeria" : undefined,
    };
    localStorage.setItem(CLAVE, JSON.stringify(nuevo));
    setPerfil(nuevo);
  }, []);

  const guardar = useCallback((datos: DatosPerfil) => {
    const final: DatosPerfil = {
      ...datos,
      slug:
        datos.rol === "empresa"
          ? datos.slug || generarSlug(datos.nombre)
          : undefined,
    };
    localStorage.setItem(CLAVE, JSON.stringify(final));
    setPerfil({ ...final });
  }, []);

  const cerrarSesion = useCallback(() => {
    localStorage.removeItem(CLAVE);
    setPerfil(null);
  }, []);

  return { perfil, listo, elegirRol, guardar, cerrarSesion };
}
