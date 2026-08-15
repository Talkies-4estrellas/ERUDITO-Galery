"use client";

import { useCallback, useEffect, useState } from "react";
import { usePerfil } from "@/hooks/usePerfil";

export type TamanoObra = "Pequeño" | "Mediano" | "Grande";
export type ColorObra  = "Cálido" | "Frío" | "Neutro";
export type TipoObra   = "Físico" | "JPG Certificado" | "Impresión Oficial";

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

export function useObrasArtista() {
  const { perfil, listo: perfilListo } = usePerfil();
  const email = perfil?.email ?? "";

  const [obras, setObras] = useState<ObraPropia[]>([]);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    if (!perfilListo) return;
    if (!email) { setListo(true); return; }

    fetch(`/api/artista/obras?email=${encodeURIComponent(email)}`)
      .then((r) => r.json())
      .then(({ obras: data }) => { setObras(data ?? []); setListo(true); })
      .catch(() => setListo(true));
  }, [email, perfilListo]);

  const agregar = useCallback(async (datos: Omit<ObraPropia, "id">) => {
    if (!email) return;
    const res = await fetch("/api/artista/obras", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, ...datos }),
    });
    const { obra } = await res.json();
    if (obra) setObras((prev) => [obra, ...prev]);
  }, [email]);

  const actualizar = useCallback(async (id: string, datos: Omit<ObraPropia, "id">) => {
    if (!email) return;
    await fetch("/api/artista/obras", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, email, ...datos }),
    });
    setObras((prev) => prev.map((o) => (o.id === id ? { ...datos, id } : o)));
  }, [email]);

  const eliminar = useCallback(async (id: string) => {
    if (!email) return;
    await fetch("/api/artista/obras", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, email }),
    });
    setObras((prev) => prev.filter((o) => o.id !== id));
  }, [email]);

  return { obras, listo, agregar, actualizar, eliminar };
}
