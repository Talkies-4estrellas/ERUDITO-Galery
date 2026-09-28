"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface Props {
  tablas: string[];
}

export default function RealtimeRefresh({ tablas }: Props) {
  const router = useRouter();

  useEffect(() => {
    const canales = tablas.map((tabla) =>
      supabase
        .channel(`rt-${tabla}`)
        .on("postgres_changes", { event: "*", schema: "public", table: tabla }, () => {
          router.refresh();
        })
        .subscribe()
    );

    return () => {
      canales.forEach((c) => supabase.removeChannel(c));
    };
  }, [tablas, router]);

  return null;
}
