"use client";

import { useEffect, useState } from "react";

const MARGEN_TOPE = 80;
const UMBRAL = 6;

/** true mientras el usuario desplaza la página hacia abajo; false al subir o cerca del inicio. */
export function useBajandoScroll(pausado = false) {
  const [bajando, setBajando] = useState(false);

  useEffect(() => {
    if (pausado) {
      setBajando(false);
      return;
    }
    let ultimoY = window.scrollY;
    const alDesplazar = () => {
      const y = window.scrollY;
      if (y < MARGEN_TOPE) setBajando(false);
      else if (y > ultimoY + UMBRAL) setBajando(true);
      else if (y < ultimoY - UMBRAL) setBajando(false);
      else return;
      ultimoY = y;
    };
    window.addEventListener("scroll", alDesplazar, { passive: true });
    return () => window.removeEventListener("scroll", alDesplazar);
  }, [pausado]);

  return bajando;
}
