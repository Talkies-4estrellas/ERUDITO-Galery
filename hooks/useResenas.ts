"use client";

import { useCallback, useEffect, useState } from "react";

const CLAVE = "erudito-resenas";

export interface Resena {
  id: string;
  obraId: string;
  nombre: string;
  estrellas: number;
  comentario: string;
  fecha: string; // ISO
}

function leerTodas(): Resena[] {
  try {
    const raw = localStorage.getItem(CLAVE);
    return raw ? (JSON.parse(raw) as Resena[]) : [];
  } catch {
    return [];
  }
}

function guardarTodas(lista: Resena[]) {
  localStorage.setItem(CLAVE, JSON.stringify(lista));
  window.dispatchEvent(new Event("erudito-resenas-cambio"));
}

export function useResenas(obraId: string) {
  const [resenas, setResenas] = useState<Resena[]>([]);

  const cargar = useCallback(() => {
    const todas = leerTodas();
    setResenas(todas.filter((r) => r.obraId === obraId));
  }, [obraId]);

  useEffect(() => {
    cargar();
    window.addEventListener("erudito-resenas-cambio", cargar);
    return () => window.removeEventListener("erudito-resenas-cambio", cargar);
  }, [cargar]);

  const agregar = useCallback(
    (datos: Omit<Resena, "id" | "obraId" | "fecha">) => {
      const nueva: Resena = {
        ...datos,
        id: crypto.randomUUID(),
        obraId,
        fecha: new Date().toISOString(),
      };
      const todas = leerTodas();
      guardarTodas([nueva, ...todas]);
    },
    [obraId]
  );

  const promedio =
    resenas.length > 0
      ? resenas.reduce((s, r) => s + r.estrellas, 0) / resenas.length
      : 0;

  return { resenas, agregar, promedio };
}
