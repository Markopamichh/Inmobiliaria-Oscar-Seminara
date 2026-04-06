import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // Reemplazar con tu project ref de Supabase
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  // Habilitar React strict mode para detectar problemas en desarrollo
  reactStrictMode: true,
};

export default nextConfig;
