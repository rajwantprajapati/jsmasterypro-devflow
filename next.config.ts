import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "png.pngtree.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "www.pngall.com",
        port: "",
      },
    ],
  },
};

export default nextConfig;
