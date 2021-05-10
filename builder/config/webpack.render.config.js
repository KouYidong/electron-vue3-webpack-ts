const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const baseConfig = require('./webpack.base.config')

const renderConfig = {
  // 打包后的入口文件
  entry: {
    main: 'index.ts'
  },
  output: {
    // 打包后的输入文件, name 作为占位符，打包生成的名称由入口文件来决定
    filename: './js/[name].[hash:8].js',
    // 打包后代码输入目录
    path: path.resolve(__dirname, '../../dist')
  },
  target: 'electron-renderer',
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
      mode: baseConfig.mode
    })
  ]
}

module.exports = merge(baseConfig, renderConfig)