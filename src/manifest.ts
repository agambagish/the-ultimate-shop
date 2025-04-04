import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The Ultimate Shop",
    short_name: "TUS",
    description:
      "Ultimate building block of your E-commerce project made with latest web technologies like Next.js, Shadcn UI, Drizzle ORM, Tailwind CSS",
    start_url: "/",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#fff",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
