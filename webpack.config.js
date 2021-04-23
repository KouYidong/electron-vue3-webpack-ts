const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  // 打包后的入口文件
  entry: './index.js',
  output: {
    // 打包后的输入文件
    filename: 'bundle.js',
    // 打包后代码输入目录
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}