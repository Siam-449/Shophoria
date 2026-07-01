/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/products',
        has: [
          {
            type: 'query',
            key: 'moved',
            value: 'true',
          },
        ],
        destination: '/products',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;