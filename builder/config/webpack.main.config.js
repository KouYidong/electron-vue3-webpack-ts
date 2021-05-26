const { merge } = require('webpack-merge')
const path = require('path')
const baseConfig = require('./webpack.base.config')

const mainConfig = {
  entry: {
    main: './main.ts'
  },
  // 这里的 path 和 filename 会影响 main.ts 中 win.loadFile() 的参数地址
  output: {
    path: path.join(process.cwd(), 'dist'),
    filename: './js/main.js'
  },
  // 指定 webpack 的构建环境，官方解释：https://webpack.docschina.org/configuration/target/
  target: 'electron-main'
}

module.exports = merge(baseConfig, mainConfig)