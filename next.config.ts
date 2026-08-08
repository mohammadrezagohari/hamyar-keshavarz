import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  experimental: {
    // Nine optional image fields can each contain a validated 2 MB file.
    serverActions: { bodySizeLimit: "20mb" },
  },
};

export default nextConfig;
