import { MetadataRoute } from "next";
import { POPULAR_ROUTES, getRouteSlug } from "@/lib/popular-routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.vooscortex.com.br";

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${baseUrl}/#valores`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/#faq`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
  ];

  const routePages = POPULAR_ROUTES.map((route) => ({
    url: `${baseUrl}/voos/${getRouteSlug(route)}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  return [...staticPages, ...routePages];
}
