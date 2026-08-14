"use client";

import { useCallback, useEffect, useState } from "react";
import { usePerfil } from "@/hooks/usePerfil";

export interface Resena {
  id: number;
  nombre: string;
  estrellas: number;
  comentario: string;
  fecha: string; // ISO — mapeado desde created_at
}

export function useResenas(obraId: string | number) {
  const { perfil } = usePerfil();
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const res = await fetch(`/api/resenas?obra_id=${obraId}`);
      if (!res.ok) return;
      const { resenas: data } = await res.json();
      setResenas(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (data as any[]).map((r) => ({ id: r.id, nombre: r.nombre, estrellas: r.estrellas, comentario: r.comentario, fecha: r.created_at }))
      );
    } finally {
      setCargando(false);
    }
  }, [obraId]);

  useEffect(() => { cargar(); }, [cargar]);

  const agregar = useCallback(
    async (datos: { nombre: string; estrellas: number; comentario: string }): Promise<{ ok: boolean; error?: string }> => {
      const res = await fetch("/api/resenas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          obra_id: Number(obraId),
          nombre: datos.nombre,
          estrellas: datos.estrellas,
          comentario: datos.comentario,
          email: perfil?.email ?? undefined,
        }),
      });
      const body = await res.json();
      if (!res.ok) return { ok: false, error: body.error ?? "Error al publicar reseña" };
      const nueva: Resena = {
        id: body.resena.id,
        nombre: body.resena.nombre,
        estrellas: body.resena.estrellas,
        comentario: body.resena.comentario,
        fecha: body.resena.created_at,
      };
      setResenas((prev) => [nueva, ...prev]);
      return { ok: true };
    },
    [obraId, perfil]
  );

  const promedio =
    resenas.length > 0
      ? resenas.reduce((s, r) => s + r.estrellas, 0) / resenas.length
      : 0;

  return { resenas, agregar, promedio, cargando };
}
