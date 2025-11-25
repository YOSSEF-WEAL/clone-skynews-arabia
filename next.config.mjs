/** @type {import('next').NextConfig} */
const parseBaseUrl = () => {
  const rawBase =
    process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'http://localhost:3000';
  try {
    return new URL(rawBase);
  } catch {
    return new URL('http://localhost:3000');
  }
};

const baseUrl = parseBaseUrl();
const baseHost = baseUrl.hostname;
const normalizedHost = baseHost?.replace(/^www\./, '');
const extraImageHosts = (process.env.NEXT_PUBLIC_IMAGE_HOSTS || '')
  .split(',')
  .map((host) => host.trim())
  .filter(Boolean);

// Collect all hosts we want to allow images from: WP domain from env + common WordPress CDNs
const allowedImageHosts = Array.from(
  new Set(
    [
      baseHost,
      normalizedHost,
      normalizedHost ? `www.${normalizedHost}` : null,
      ...extraImageHosts,
      'i0.wp.com',
      'i1.wp.com',
      'i2.wp.com',
      'secure.gravatar.com',
      'gravatar.com',
      'img.wataninet.com',
    ].filter(Boolean)
  )
);

const nextConfig = {
  experimental: {
    useCache: true,
  },
  images: {
    remotePatterns: allowedImageHosts.map((hostname) => ({
      protocol: hostname === baseHost ? baseUrl.protocol.replace(':', '') || 'https' : 'https',
      hostname,
      pathname: '/**',
    })),
    // domains is kept for backwards-compatibility with older patterns
    domains: allowedImageHosts,
    qualities: [75, 85, 90, 100],
  },
};

export default nextConfig;
