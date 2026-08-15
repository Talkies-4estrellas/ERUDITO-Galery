"use client";

import { useCallback, useEffect, useState } from "react";
import { usePerfil } from "@/hooks/usePerfil";

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

export function useObrasEmpresa() {
  const { perfil, listo: perfilListo } = usePerfil();
  const email = perfil?.email ?? "";
  const [obras, setObras] = useState<ObraEmpresa[]>([]);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    if (!perfilListo) return;
    if (!email) { setListo(true); return; }
    fetch(`/api/empresa/obras?email=${encodeURIComponent(email)}`)
      .then((r) => r.json())
      .then(({ obras: data }) => { setObras(data ?? []); setListo(true); })
      .catch(() => setListo(true));
  }, [email, perfilListo]);

  const agregar = useCallback(async (datos: Omit<ObraEmpresa, "id">) => {
    if (!email) return;
    const res = await fetch("/api/empresa/obras", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, ...datos }),
    });
    const { obra } = await res.json();
    if (obra) setObras((prev) => [obra, ...prev]);
  }, [email]);

  const actualizar = useCallback(async (id: string, datos: Omit<ObraEmpresa, "id">) => {
    if (!email) return;
    await fetch("/api/empresa/obras", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, email, ...datos }),
    });
    setObras((prev) => prev.map((o) => (o.id === id ? { ...datos, id } : o)));
  }, [email]);

  const eliminar = useCallback(async (id: string) => {
    if (!email) return;
    await fetch("/api/empresa/obras", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, email }),
    });
    setObras((prev) => prev.filter((o) => o.id !== id));
  }, [email]);

  return { obras, listo, agregar, actualizar, eliminar };
}
