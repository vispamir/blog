import type { NextConfig } from "next";
const config: NextConfig = {
  output: "standalone",
  trailingSlash: true,
  images: { unoptimized: true },
  outputFileTracingIncludes: {
    "/*": ["./content/articles/**/*", "./public/images/diagrams/**/*"],
  },
};
export default config;
