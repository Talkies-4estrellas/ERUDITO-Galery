"use client";

import { useCallback, useEffect, useState } from "react";

const CLAVE = "erudito-tema";
export type Tema = "oscuro" | "claro";

function aplicarTema(tema: Tema) {
  document.documentElement.setAttribute(
    "data-theme",
    tema === "claro" ? "light" : "dark"
  );
}

export function useTema() {
  const [tema, setTema] = useState<Tema>("oscuro");
  const [listo, setListo] = useState(false);

  useEffect(() => {
    const guardado = localStorage.getItem(CLAVE) as Tema | null;
    const t = guardado ?? "oscuro";
    setTema(t);
    aplicarTema(t);
    setListo(true);

    const observer = new MutationObserver(() => {
      const attr = document.documentElement.getAttribute("data-theme");
      setTema(attr === "light" ? "claro" : "oscuro");
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  const alternar = useCallback(() => {
    setTema((prev) => {
      const nuevo: Tema = prev === "oscuro" ? "claro" : "oscuro";
      localStorage.setItem(CLAVE, nuevo);
      aplicarTema(nuevo);
      return nuevo;
    });
  }, []);

  return { tema, alternar, listo };
}
