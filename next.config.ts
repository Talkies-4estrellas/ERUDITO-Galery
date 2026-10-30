import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 días
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        // Supabase Storage — bucket "obras" y avatares de perfiles
        protocol: "https",
        hostname: "ehpvkbazeblmprubkcqh.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        // Wikimedia Commons / Wikipedia — imágenes de obras y artistas
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      // Fotos de productos de cocina enlazadas desde el sitio de cada productor o tienda
      ...[
        "vainillapapantla.com",
        "www.mexicomiamor.de",
        "oaxacanitachocolate.com",
        "yucatantoday.com",
        "cuyusal.com",
        "ss302.liverpool.com.mx",
        "www.mezcalreviews.com",
        "afar.brightspotcdn.com",
        "yaxool.com",
        "www.mexicodesconocido.com.mx",
      ].map((hostname) => ({ protocol: "https" as const, hostname })),
    ],
  },
};

export default nextConfig;
