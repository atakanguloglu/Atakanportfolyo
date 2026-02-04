/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["primefaces.org", "images.unsplash.com"],
    unoptimized: true,
  },
  // Sunucuya deploy için: .next/standalone ile tek klasörde çalıştırılabilir
  output: "standalone",
};

export default nextConfig;
