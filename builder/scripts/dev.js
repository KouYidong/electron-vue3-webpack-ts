process.env.NODE_ENV = 'development'
const webpack = require('webpack')

/**
 * 启动 dev server
 */
const startDevServer = () => {
  console.log('----- startDevServer -----')

  const renderConfig = require('../scripts/webpack.render.config.js')
  const compiler = webpack(renderConfig)


  console.log('----- devServerEnd -----')
}

startDevServer()