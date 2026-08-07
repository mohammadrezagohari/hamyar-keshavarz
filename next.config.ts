import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  experimental: {
    // The admin form can upload one 2 MB hero plus five 2 MB sponsor logos.
    serverActions: { bodySizeLimit: "13mb" },
  },
};

export default nextConfig;
