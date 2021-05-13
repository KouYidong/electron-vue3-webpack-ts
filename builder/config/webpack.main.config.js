const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base.config')

const mainConfig = {
  // 指定 webpack 的构建环境，官方解释：https://webpack.docschina.org/configuration/target/
  target: 'electron-main'
}

module.exports = merge(baseConfig, mainConfig)