process.env.NODE_ENV = 'development'
const webpack = require('webpack')
const del = require('del')
const WebpackDevServer = require('webpack-dev-server')

/**
 * 启动 dev server
 */
const startDevServer = () => {
  console.log('----- startDevServer -----')

  // 删除 dist 目录
  del(['./dist'])

  const renderConfig = require('../config/webpack.render.config.js')
  const options = {
    contentBase: renderConfig.output.path,
    hot: true, // 热更新
    // open: true, // 自动打开浏览器
    // hotOnly: true,
  }

  // WebpackDevServer.addDevServerEntrypoints(renderConfig, options);
  const compiler = webpack(renderConfig)

  new WebpackDevServer(compiler, options).listen(8080, (err) => {
    if (err) {
      console.error(`WebpackDevServer listen error =>`, err)
      return process.exit()
    }
    console.log(`Listening 8080 success`)
  })


  console.log('----- devServerEnd -----')
}

startDevServer()