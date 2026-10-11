import type { NextConfig } from "next";
const config: NextConfig = {
  devIndicators: false,
  async redirects() {
    return [
      { source: "/dathaaa", destination: "/invitation", permanent: false },
      { source: "/thanhdatminhhawedding", destination: "/", permanent: false },
    ];
  },
};
export default config;
