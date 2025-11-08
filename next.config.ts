// next.config.ts
import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "export",
  ...(isGithubPages && {
    basePath: "/evenup-web",
    assetPrefix: "/evenup-web",
  }),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
