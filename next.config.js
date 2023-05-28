/** @type {import('next').NextConfig} */
const removeImports = require("next-remove-imports")();
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  experimental: { esmExternals: true },
  reactStrictMode: true,
  assetPrefix: isProd ? '/code-rewrite' : undefined,
}

module.exports = removeImports(nextConfig);
