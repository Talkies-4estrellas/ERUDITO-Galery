import type { MetadataRoute } from "next";

const BASE = "https://erudito-galery.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/privado", "/perfil", "/api/"],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
