import type { MetadataRoute } from "next";

const SITE_URL = "https://evenup.in";

export const dynamic = "force-static";

const publicRoutes = [
  { path: "/", priority: 1 },
  { path: "/about/", priority: 0.8 },
  { path: "/support/", priority: 0.7 },
  { path: "/privacy/", priority: 0.5 },
  { path: "/terms/", priority: 0.5 },
  { path: "/delete-account/", priority: 0.4 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-07-01");

  return publicRoutes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified,
    changeFrequency: "monthly",
    priority: route.priority,
  }));
}
