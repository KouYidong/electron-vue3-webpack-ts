const { merge } = require('webpack-merge')
const path = require('path')
const baseConfig = require('./webpack.base.config')

const mainConfig = {
  entry: {
    main: './main.ts'
  },
  output: {
    path: path.join(process.cwd(), 'package')
  },
  // 指定 webpack 的构建环境，官方解释：https://webpack.docschina.org/configuration/target/
  target: 'electron-main'
}

module.exports = merge(baseConfig, mainConfig)