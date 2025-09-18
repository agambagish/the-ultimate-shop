import type { NextConfig } from "next";

import { withPayload } from "@payloadcms/next/withPayload";

import "./src/env";

const nextConfig: NextConfig = {
  /* config options here */
};

export default withPayload(nextConfig);
