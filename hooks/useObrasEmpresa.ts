"use client";

import { useCallback, useEffect, useState } from "react";

const CLAVE = "erudito-mis-obras-empresa";

export type TamanoObra = "Pequeño" | "Mediano" | "Grande" | "Extra grande";
export type ColorObra = "Cálido" | "Frío" | "Neutro" | "Multicolor";
export type TipoObra = "Físico" | "JPG Certificado" | "Edición limitada";

export interface ObraEmpresa {
  id: string;
  nombreArtista: string;
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

function leer(): ObraEmpresa[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CLAVE);
    return raw ? (JSON.parse(raw) as ObraEmpresa[]) : [];
  } catch {
    return [];
  }
}

function escribir(obras: ObraEmpresa[]) {
  localStorage.setItem(CLAVE, JSON.stringify(obras));
  window.dispatchEvent(new Event("erudito-obras-empresa-cambio"));
}

export function useObrasEmpresa() {
  const [obras, setObras] = useState<ObraEmpresa[]>([]);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    setObras(leer());
    setListo(true);
    const handler = () => setObras(leer());
    window.addEventListener("erudito-obras-empresa-cambio", handler);
    return () => window.removeEventListener("erudito-obras-empresa-cambio", handler);
  }, []);

  const agregar = useCallback((datos: Omit<ObraEmpresa, "id">) => {
    const nueva: ObraEmpresa = {
      ...datos,
      id: `obra-emp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    };
    const actuales = leer();
    escribir([nueva, ...actuales]);
    setObras([nueva, ...actuales]);
  }, []);

  const actualizar = useCallback((id: string, datos: Omit<ObraEmpresa, "id">) => {
    const actuales = leer();
    const nuevas = actuales.map((o) => (o.id === id ? { ...datos, id } : o));
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
