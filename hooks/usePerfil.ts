"use client";

import { useCallback, useEffect, useState } from "react";

const CLAVE = "erudito-perfil";

export type Rol = "artista" | "comprador";

export interface DatosPerfil {
  rol: Rol;
  nombre: string;
  bio: string;
  especialidad: string;
  pais: string;
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
    const nuevo: DatosPerfil = { ...VACIO, rol };
    localStorage.setItem(CLAVE, JSON.stringify(nuevo));
    setPerfil(nuevo);
  }, []);

  const guardar = useCallback((datos: DatosPerfil) => {
    localStorage.setItem(CLAVE, JSON.stringify(datos));
    setPerfil({ ...datos });
  }, []);

  const cerrarSesion = useCallback(() => {
    localStorage.removeItem(CLAVE);
    setPerfil(null);
  }, []);

  return { perfil, listo, elegirRol, guardar, cerrarSesion };
}
