"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePerfil } from "@/hooks/usePerfil";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ToastProvider";
import SelectorRol from "@/components/SelectorRol";
import MiPerfilArtista from "@/components/MiPerfilArtista";
import PerfilComprador from "@/components/PerfilComprador";
import MiPerfilEmpresa from "@/components/MiPerfilEmpresa";
import MiPerfilProductor from "@/components/MiPerfilProductor";

function BannerPendiente({ email, nombre, rol }: { email: string; nombre: string; rol: string }) {
  const { toast } = useToast();

  useEffect(() => {
    const canal = supabase
      .channel("aprobacion-" + email)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "solicitudes", filter: `email=eq.${email}` },
        (payload) => {
          if (payload.new.estado === "aprobado") {
            try {
              const raw = localStorage.getItem("erudito-perfil");
              if (raw) {
                const actual = JSON.parse(raw);
                const actualizado = { ...actual, estado: undefined };
                localStorage.setItem("erudito-perfil", JSON.stringify(actualizado));
                window.dispatchEvent(new CustomEvent("erudito-perfil-actualizado", { detail: actualizado }));
              }
            } catch { /* noop */ }
            toast("¡Tu solicitud fue aprobada! Ya puedes usar la plataforma.", { icono: "🎉" });
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(canal); };
  }, [email, toast]);

  const rolLabel = rol === "artista" ? "Artista" : "Galería / Empresa";

  return (
    <section className="mx-auto w-full max-w-lg px-4 pb-16 pt-16 text-center">
      <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-amber-400/10 ring-1 ring-amber-400/20">
        <span className="text-4xl">⏳</span>
      </div>

      <h1 className="mt-6 text-xl font-bold text-white">Solicitud en revisión</h1>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">
        Hola <span className="font-semibold text-zinc-200">{nombre || email}</span>, tu solicitud como{" "}
        <span className="font-semibold text-amber-400">{rolLabel}</span> está siendo evaluada por el equipo de ERUDITO.
      </p>

      <div className="mt-6 space-y-3 rounded-2xl bg-zinc-900 p-5 text-left ring-1 ring-white/8">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-amber-400/15 text-xs font-bold text-amber-400 ring-1 ring-amber-400/20">1</span>
          <p className="text-sm text-zinc-300">Tu solicitud está en revisión</p>
        </div>
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs font-bold text-zinc-500 ring-1 ring-white/10">2</span>
          <p className="text-sm text-zinc-500">El administrador la evaluará pronto</p>
        </div>
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs font-bold text-zinc-500 ring-1 ring-white/10">3</span>
          <p className="text-sm text-zinc-500">Al ser aprobada tu perfil se activará aquí mismo</p>
        </div>
      </div>

      <p className="mt-6 text-xs text-zinc-600">
        ¿Tienes dudas? Escríbenos a{" "}
        <a href="mailto:contacto@erudito-galeria.vercel.app" className="text-zinc-400 hover:text-zinc-200 transition">
          contacto@erudito-galeria.vercel.app
        </a>
      </p>
    </section>
  );
}

export default function PaginaPerfil() {
  const { perfil, listo, elegirRol } = usePerfil();
  const router = useRouter();

  useEffect(() => {
    if (listo && perfil?.rol === "admin") {
      router.replace("/admin");
    }
  }, [listo, perfil, router]);

  if (!listo) return null;
  if (perfil?.rol === "admin") return null;

  if (!perfil) return <SelectorRol onElegir={elegirRol} />;

  if (perfil.estado === "pendiente") {
    return (
      <BannerPendiente
        email={perfil.email ?? ""}
        nombre={perfil.nombre}
        rol={perfil.rol}
      />
    );
  }

  if (perfil.rol === "artista")   return <MiPerfilArtista />;
  if (perfil.rol === "empresa")   return <MiPerfilEmpresa />;
  if (perfil.rol === "productor") return <MiPerfilProductor />;

  return <PerfilComprador />;
}
