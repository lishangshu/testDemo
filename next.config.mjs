/** @type {import('next').NextConfig} */
const nextConfig = {
  sourceMap: true,
  reactStrictMode: true,
  i18n: {
    locales: ["en", "jp", "zh"],
    defaultLocale: "en",
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
