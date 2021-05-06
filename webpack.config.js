const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  mode: 'development',
  // 打包后的入口文件
  entry: {
    'bundle': ['./index.js'],
    'main': ['./main.js']
  },
  output: {
    // 打包后的输入文件, name 作为占位符，打包生成的名称由入口文件来决定
    filename: '[name].js',
    // 打包后代码输入目录
    path: path.resolve(__dirname, 'dist')
  },
  target: 'electron-renderer',
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/]
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ],
  resolve: {
    extensions: ['.js', '.vue', '.json', 'ts', 'tsx']
  }
}