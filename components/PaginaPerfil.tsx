"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePerfil } from "@/hooks/usePerfil";
import SelectorRol from "@/components/SelectorRol";
import MiPerfilArtista from "@/components/MiPerfilArtista";
import PerfilComprador from "@/components/PerfilComprador";
import MiPerfilEmpresa from "@/components/MiPerfilEmpresa";

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

  if (perfil.rol === "artista") return <MiPerfilArtista />;
  if (perfil.rol === "empresa") return <MiPerfilEmpresa />;

  return <PerfilComprador />;
}
