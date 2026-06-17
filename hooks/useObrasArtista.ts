"use client";

import { useCallback, useEffect, useState } from "react";

const CLAVE = "erudito-mis-obras";

export type TamanoObra = "Pequeño" | "Mediano" | "Grande";
export type ColorObra = "Cálido" | "Frío" | "Neutro";
export type TipoObra = "Físico" | "JPG Certificado" | "Impresión Oficial";

export interface ObraPropia {
  id: string;
  titulo: string;
  anio: string;
  descripcion: string;
  imagen: string;
  tecnica: string;
  tamano: TamanoObra;
  color: ColorObra;
  movimiento: string;
  precio: number;
  tipo: TipoObra;
}

export const OBRA_VACIA: Omit<ObraPropia, "id"> = {
  titulo: "",
  anio: new Date().getFullYear().toString(),
  descripcion: "",
  imagen: "",
  tecnica: "",
  tamano: "Mediano",
  color: "Cálido",
  movimiento: "",
  precio: 0,
  tipo: "Físico",
};

function leer(): ObraPropia[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CLAVE);
    return raw ? (JSON.parse(raw) as ObraPropia[]) : [];
  } catch {
    return [];
  }
}

function escribir(obras: ObraPropia[]) {
  localStorage.setItem(CLAVE, JSON.stringify(obras));
}

export function useObrasArtista() {
  const [obras, setObras] = useState<ObraPropia[]>([]);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    setObras(leer());
    setListo(true);
  }, []);

  const agregar = useCallback((datos: Omit<ObraPropia, "id">) => {
    const nueva: ObraPropia = {
      ...datos,
      id: `obra-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    };
    const actuales = leer();
    const nuevas = [...actuales, nueva];
    escribir(nuevas);
    setObras(nuevas);
  }, []);

  const actualizar = useCallback((id: string, datos: Omit<ObraPropia, "id">) => {
    const actuales = leer();
    const nuevas = actuales.map((o) =>
      o.id === id ? { ...datos, id } : o
    );
    escribir(nuevas);
    setObras(nuevas);
  }, []);

  const eliminar = useCallback((id: string) => {
    const actuales = leer();
    const nuevas = actuales.filter((o) => o.id !== id);
    escribir(nuevas);
    setObras(nuevas);
  }, []);

  return { obras, listo, agregar, actualizar, eliminar };
}
