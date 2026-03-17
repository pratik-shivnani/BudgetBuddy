/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/BudgetBuddy' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/BudgetBuddy/' : '',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
