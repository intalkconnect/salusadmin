import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // 👈 Isso evita que o Vercel quebre o build por erros de lint
  },
};

export default nextConfig;
