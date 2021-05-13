process.env.NODE_ENV = 'development'
const webpack = require('webpack')
const del = require('del')
const chalk = require('chalk')
const webpackHotMiddleware = require('webpack-hot-middleware')
const WebpackDevServer = require('webpack-dev-server')

/**
 * webpack 本地服务
 */
const devServer = () => {
  return new Promise((resolve, reject) => {

    console.log('----- startDevServer -----')

    // 删除 dist 目录
    del(['./dist'])

    const renderConfig = require('../config/webpack.render.config.js')

    // WebpackDevServer.addDevServerEntrypoints(renderConfig, options);
    const renderCompiler = webpack(renderConfig)
    const options = {
      contentBase: renderConfig.output.path,
      publicPath: renderConfig.output.publicPath,
      hot: true, // 热更新
      open: true, // 自动打开浏览器
      // hotOnly: true,
      // host: 'localhost'
      inline: true,
      progress: true,//显示打包进度
      setup(app) {
        app.use(webpackHotMiddleware(renderCompiler));
        app.use('*', (req, res, next) => {
          if (String(req.originalUrl).indexOf('.html') > 0) {
            console.log(req.originalUrl)
            // getHtml(res);
          } else {
            next();
          }
        });
      }
    }

    new WebpackDevServer(renderCompiler, options).listen(8080, (err) => {
      if (err) {
        console.error(`WebpackDevServer listen error =>`, err)
        reject(err)
        return process.exit()
      }
      console.log(`Listening 8080 success`)
      resolve(`Listening 8080 success`)
    })

    renderCompiler.hooks.done.tap('doneCallback', (stats) => {
      const compilation = stats.compilation;
      Object.keys(compilation.assets).forEach(key => console.log(chalk.blue(key)));
      compilation.warnings.forEach(key => console.log(chalk.yellow(key)));
      compilation.errors.forEach(key => console.log(chalk.red(`${key}:${stats.compilation.errors[key]}`)));
      console.log(chalk.green(`${chalk.white('渲染进程调试完毕\n')}time:${(stats.endTime - stats.startTime) / 1000} s`));
    });


    console.log('----- devServerEnd -----')
  })
}

/**
 * 构建主进程
 */
const buildMain = () => {

  return new Promise((resolve, reject) => {

    // 删除 package 目录
    del(['./package'])

    const mainConfig = require('../config/webpack.main.config')
    const mainCompiler = webpack(mainConfig)
    let log = ''

    mainCompiler.run((err, stats) => {
      let errorInfo = '';
      if (err) {
        console.log('打包主进程遇到Error！');
        reject(chalk.red(err));
      } else {
        Object.keys(stats.compilation.assets).forEach(key => {
          log += chalk.blue(key) + '\n';
        })
        stats.compilation.warnings.forEach(key => {
          log += chalk.yellow(key) + '\n';
        })
        stats.compilation.errors.forEach(key => {
          errorInfo += chalk.red(`${key}:${stats.compilation.errors[key]}`) + '\n';
        })
        log += errorInfo + chalk.green(`time：${(stats.endTime - stats.startTime) / 1000} s\n`) + "\n";
        if (errorInfo) {
          reject(errorInfo)
        } else {
          resolve(log);
        }
        console.log('打包主进程完毕！', log);
      }
    })
  })

}

const build = () => {
  Promise.all([devServer()]).then(() => {
    buildMain()
    console.log('开始启动 electron')
  })
}

build()