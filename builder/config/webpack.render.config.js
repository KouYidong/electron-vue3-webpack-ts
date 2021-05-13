const { merge } = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const baseConfig = require('./webpack.base.config')

const renderConfig = {
  // 打包后的入口文件
  entry: {
    main: './index.ts'
  },
  output: {
    // 打包后的输入文件, name 作为占位符，打包生成的名称由入口文件来决定
    filename: './js/[name].[hash:8].js',
    // 打包后代码输入目录
    path: path.resolve(__dirname, '../../dist'),
    // publicPath: '/',
    /**
     * 解决 target 设置为 electron-renderer 通过 webpack-dev-server 配置 hot:true 后启动项目页面报错 global is not defined 的问题
     * https://segmentfault.com/q/1010000018724692
     */
    // globalObject: 'this',
  },
  node: {
    global: true
  },
  // target: 'electron-renderer',
  plugins: [
    /**
     * 如果不传入配置则默认在 output.path 目录下生成一个 index.html 文件，并且在 index.html 文件中插入 output.filename 中的 js 文件。
     * https://github.com/jantimon/html-webpack-plugin#configuration
     * https://juejin.cn/post/6844903853708541959
     */
    new HtmlWebpackPlugin({
      title: 'electron-vue3-webpack-ts', // 网页 document.title 的配置, 在index.html 文件中可以使用 <%= htmlWebpackPlugin.options.title %> 设置网页标题为这里设置的值。
      filename: 'index.html', // html 文件生成的名称， 默认为 index.html
      template: 'index.html', // 生成 filename 文件的模版， 如果存在 src/index.ejs， 那么默认将会使用这个文件作为模版。
      hash: true, // 如果为真，则向所有包含的 js 和 CSS 文件附加一个惟一的 webpack 编译散列。这对于更新每次的缓存文件名称非常有用
      cache: true, // 设置 js css 文件的缓存，当文件没有发生变化时， 是否设置使用缓存
      showErrors: true, // 当文件发生错误时， 是否将错误显示在页面
    })
  ]
}

module.exports = merge(baseConfig, renderConfig)