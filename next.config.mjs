/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@libsql/client"],
  },
  staticPageGenerationTimeout: 0,
};

export default nextConfig;