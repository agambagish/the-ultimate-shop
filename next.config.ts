import type { NextConfig } from "next";

import "./src/env";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "images.pexels.com",
      },
    ],
  },
};

export default nextConfig;
