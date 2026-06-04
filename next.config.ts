import type { NextConfig } from "next";

const maxFileSizeMb = Number.parseInt(process.env.MAX_FILE_SIZE_MB ?? "100", 10);
const uploadSizeLimitBytes = (Number.isFinite(maxFileSizeMb) ? maxFileSizeMb : 100) * 1024 * 1024;

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    proxyClientMaxBodySize: uploadSizeLimitBytes,
  },
};

export default nextConfig;
