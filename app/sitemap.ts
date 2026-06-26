import type { MetadataRoute } from "next";
import { fichas } from "@/data/fichas";
import { artistas } from "@/data/artistas";
import { articulos } from "@/data/articulos";
import { servicios } from "@/data/servicios";

const BASE = "https://erudito-galery.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const estaticas: MetadataRoute.Sitemap = [
    { url: BASE, priority: 1 },
    { url: `${BASE}/obras`, priority: 0.9 },
    { url: `${BASE}/artistas`, priority: 0.9 },
    { url: `${BASE}/catalogo`, priority: 0.8 },
    { url: `${BASE}/servicios`, priority: 0.8 },
    { url: `${BASE}/blog`, priority: 0.7 },
    { url: `${BASE}/eventos`, priority: 0.7 },
    { url: `${BASE}/cocina`, priority: 0.6 },
    { url: `${BASE}/contacto`, priority: 0.5 },
  ];

  const obras: MetadataRoute.Sitemap = fichas.map((f) => ({
    url: `${BASE}/obra/${f.id}`,
    priority: 0.7,
  }));

  const artistasSitemap: MetadataRoute.Sitemap = artistas.map((a) => ({
    url: `${BASE}/artista/${a.id}`,
    priority: 0.7,
  }));

  const blog: MetadataRoute.Sitemap = articulos.map((a) => ({
    url: `${BASE}/blog/${a.id}`,
    priority: 0.6,
  }));

  const serviciosSitemap: MetadataRoute.Sitemap = servicios.map((s) => ({
    url: `${BASE}/servicios/${s.slug}`,
    priority: 0.6,
  }));

  return [...estaticas, ...obras, ...artistasSitemap, ...blog, ...serviciosSitemap];
}
