import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteConfig.url}/products`,
      lastModified: new Date(),
    },
    {
      url: `${siteConfig.url}/stores`,
      lastModified: new Date(),
    },
    {
      url: `${siteConfig.url}/onboarding`,
      lastModified: new Date(),
    },
  ];
}
