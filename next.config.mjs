import { createContentlayerPlugin } from 'next-contentlayer'

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    })
    return config
  }
}

const withContentlayer = createContentlayerPlugin({
  // Additional Contentlayer config options
})
export default withContentlayer(nextConfig)
