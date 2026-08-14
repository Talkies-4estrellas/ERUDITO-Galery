"use client";

import { useEffect } from "react";
import { incrementarVistas } from "@/lib/db";

export default function RegistrarVisita({ id }: { id: number }) {
  useEffect(() => {
    incrementarVistas(id).catch(() => {});
  }, [id]);
  return null;
}
