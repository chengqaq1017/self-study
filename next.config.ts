import type { NextConfig } from "next";

const maxFileSizeMb = Number.parseInt(process.env.MAX_FILE_SIZE_MB ?? "50", 10);
const uploadSizeLimitBytes = (Number.isFinite(maxFileSizeMb) ? maxFileSizeMb : 200) * 1024 * 1024;

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    proxyClientMaxBodySize: uploadSizeLimitBytes,
  },
};

export default nextConfig;
