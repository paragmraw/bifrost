import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML/CSS/JS export — no Node server at runtime.
  // The nginx runtime stage of the Dockerfile serves the built `out/`.
  output: "export",

  // Image optimization requires a Node server; for static export we serve
  // images as-is from the public/ folder.
  images: {
    unoptimized: true,
  },

  // Disable source maps in production to avoid leaking source structure.
  productionBrowserSourceMaps: false,

  // App Router pages are statically generated at build time. Every route is
  // emitted as a directory with index.html, which nginx serves directly.
  trailingSlash: true,
};

export default nextConfig;