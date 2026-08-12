/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    REACT_APP_BACKEND_URL: process.env.REACT_APP_BACKEND_URL,
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  // Allow the Emergent preview proxy origin during dev (Next 15.1+)
  allowedDevOrigins: ['*.preview.emergentagent.com', '*.emergentagent.com'],
};

module.exports = nextConfig;
