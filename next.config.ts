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
        hostname: "dtqijxpdavazfovpzjmw.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        // Wikimedia Commons / Wikipedia — imágenes de obras y artistas
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
    ],
  },
};

export default nextConfig;
