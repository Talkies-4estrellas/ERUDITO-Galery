"use client";

import { usePerfil } from "@/hooks/usePerfil";
import SelectorRol from "@/components/SelectorRol";
import MiPerfilArtista from "@/components/MiPerfilArtista";
import PerfilComprador from "@/components/PerfilComprador";

export default function PaginaPerfil() {
  const { perfil, listo, elegirRol } = usePerfil();

  if (!listo) return null;

  if (!perfil) return <SelectorRol onElegir={elegirRol} />;

  if (perfil.rol === "artista") return <MiPerfilArtista />;

  return <PerfilComprador />;
}
