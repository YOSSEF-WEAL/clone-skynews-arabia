/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "a3raff.com",
        port: "",
        pathname: "/next/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "img.wataninet.com",
        port: "",
        pathname: "/**",
      },
    ],
    qualities: [75, 85, 90, 100],
  },
};

export default nextConfig;
