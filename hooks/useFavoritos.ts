"use client";

import { useCallback, useEffect, useState } from "react";

const CLAVE = "erudito-favoritos";
const EVENTO = "erudito-favoritos-cambio";

function leerFavoritos(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const crudo = window.localStorage.getItem(CLAVE);
    return crudo ? (JSON.parse(crudo) as number[]) : [];
  } catch {
    return [];
  }
}

/** Maneja la lista de obras favoritas, persistida en localStorage. */
export function useFavoritos() {
  const [favoritos, setFavoritos] = useState<number[]>([]);
  const [listo, setListo] = useState(false);

  // Carga inicial + escucha cambios hechos por otras instancias del hook
  useEffect(() => {
    setFavoritos(leerFavoritos());
    setListo(true);

    const sync = () => setFavoritos(leerFavoritos());
    window.addEventListener(EVENTO, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENTO, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  // El cálculo y el efecto secundario (persistir + notificar) ocurren
  // directamente en el manejador de clic, NUNCA dentro del updater de
  // setState — hacerlo dentro causaba "setState durante el render de
  // otro componente" al disparar el evento que otras instancias escuchan.
  const alternar = useCallback(
    (id: number) => {
      const nuevos = favoritos.includes(id)
        ? favoritos.filter((f) => f !== id)
        : [...favoritos, id];
      setFavoritos(nuevos);
      try {
        window.localStorage.setItem(CLAVE, JSON.stringify(nuevos));
        window.dispatchEvent(new Event(EVENTO));
      } catch {
        // localStorage no disponible (modo privado, etc.) — se ignora
      }
    },
    [favoritos]
  );

  const esFavorito = useCallback(
    (id: number) => favoritos.includes(id),
    [favoritos]
  );

  return { favoritos, alternar, esFavorito, listo };
}
