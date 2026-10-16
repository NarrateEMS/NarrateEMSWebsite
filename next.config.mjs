/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // The signing route stamps these PDFs from disk.
  outputFileTracingIncludes: {
    '/api/agency-agreement': ['./public/legal/agency-*.pdf'],
  },
  async redirects() {
    return ['terms-of-service', 'privacy-policy', 'sla'].map((page) => ({
      source: `/${page}`,
      destination: `/legal/${page}.pdf`,
      permanent: false,
    }))
  },
}

export default nextConfig
