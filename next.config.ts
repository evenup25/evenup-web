import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "export",
  images: {
    unoptimized: true,
  },
  // Don't use basePath for custom domain
  trailingSlash: true,
};

export default nextConfig;
