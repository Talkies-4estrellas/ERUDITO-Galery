"use client";

import { useCallback, useEffect, useState } from "react";

const CLAVE = "erudito-comparar";
const EVENTO = "erudito-comparar-cambio";
export const MAX_COMPARAR = 3;

function leer(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const crudo = window.localStorage.getItem(CLAVE);
    return crudo ? (JSON.parse(crudo) as number[]) : [];
  } catch {
    return [];
  }
}

/** Maneja hasta MAX_COMPARAR obras seleccionadas para comparar, persistidas en localStorage. */
export function useComparacion() {
  const [seleccion, setSeleccion] = useState<number[]>([]);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    setSeleccion(leer());
    setListo(true);

    const sync = () => setSeleccion(leer());
    window.addEventListener(EVENTO, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENTO, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  // Igual que useFavoritos: el efecto secundario va en el manejador,
  // nunca dentro del callback de setState.
  const alternar = useCallback(
    (id: number) => {
      if (!seleccion.includes(id) && seleccion.length >= MAX_COMPARAR) return;
      const nuevos = seleccion.includes(id)
        ? seleccion.filter((f) => f !== id)
        : [...seleccion, id];
      setSeleccion(nuevos);
      try {
        window.localStorage.setItem(CLAVE, JSON.stringify(nuevos));
        window.dispatchEvent(new Event(EVENTO));
      } catch {
        // localStorage no disponible — se ignora
      }
    },
    [seleccion]
  );

  const limpiar = useCallback(() => {
    setSeleccion([]);
    try {
      window.localStorage.setItem(CLAVE, JSON.stringify([]));
      window.dispatchEvent(new Event(EVENTO));
    } catch {
      // se ignora
    }
  }, []);

  const estaSeleccionada = useCallback(
    (id: number) => seleccion.includes(id),
    [seleccion]
  );

  return {
    seleccion,
    alternar,
    limpiar,
    estaSeleccionada,
    listo,
    lleno: seleccion.length >= MAX_COMPARAR,
  };
}
