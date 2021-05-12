process.env.NODE_ENV = 'development'
const webpack = require('webpack')
const del = require('del')

/**
 * 启动 dev server
 */
const startDevServer = () => {
  console.log('----- startDevServer -----')
  
  // 删除 dist 目录
  del(['./dist'])

  const renderConfig = require('../config/webpack.render.config.js')
  const compiler = webpack(renderConfig)
  compiler.run()


  console.log('----- devServerEnd -----')
}

startDevServer()