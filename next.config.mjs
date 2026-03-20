import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // SSR/ISR on Vercel — no static export
  images: {
    unoptimized: true,
  },
  // eslint-plugin-tailwindcss v3 与 Tailwind CSS v4 不兼容，
  // build 时跳过 ESLint（通过 pnpm lint 单独检查）
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    optimizePackageImports: ['next-themes'],
  },
};

export default withSerwist(nextConfig);
