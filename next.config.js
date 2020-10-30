// const debug = process.env.NODE_ENV !== "production"

module.exports = {
  exportPathMap: async function (defaultPathMap, { dev, dir, outDir, distDir, buildId }) {
    return {
      '/popup': { page: 'popup' }
    }
  },
  // assetPrefix: '/next'
}
