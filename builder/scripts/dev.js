process.env.NODE_ENV = 'development'
const webpack = require('webpack')
const del = require('del')
const chalk = require('chalk')
const webpackHotMiddleware = require('webpack-hot-middleware')
const WebpackDevServer = require('webpack-dev-server')
const { spawn } = require('child_process')
const electron = require('electron')
const path = require('path')
const http = require('http')
const renderConfig = require('../config/webpack.render.config.js')
const mainConfig = require('../config/webpack.main.config')

const getHtml = (res) => {
  http.get(`http://localhost:8080`, (response) => {
    response.pipe(res)
  }).on('error', (err) => {
    console.error(err)
  })
}

/**
 * webpack 本地服务
 */
const devServer = () => {
  return new Promise((resolve, reject) => {

    console.log('----- startDevServer -----')

    // 删除 dist 目录
    del(['./dist'])

    const renderCompiler = webpack(renderConfig)

    const options = {
      contentBase: renderConfig.output.path,
      publicPath: renderConfig.output.publicPath,
      hot: true, // 热更新
      // open: true, // 自动打开浏览器
      // hotOnly: true,
      // host: 'localhost'
      inline: true,
      progress: true,//显示打包进度
      quiet: true,
      disableHostCheck: true,
      /**
       * webpack-dev-server 默认是将编译后的资源放在内存中的，并不会写入磁盘中。
       * 但是启动 electron 的时候需要依赖 webpack 编译的结果，所以设置 writeToDisk 将结果写入到磁盘中。
       * https://webpack.js.org/configuration/dev-server/#devserverwritetodisk-
       */
      writeToDisk: true,
      setup(app) {
        app.use(webpackHotMiddleware(renderCompiler));
        app.use('*', (req, res, next) => {
          if (String(req.originalUrl).indexOf('.html') > 0) {
            console.log(req.originalUrl)
            getHtml(res);
          } else {
            next();
          }
        });
      }
    }

    // WebpackDevServer.addDevServerEntrypoints(renderConfig, options);
    new WebpackDevServer(renderCompiler, options).listen(8080, (err) => {
      if (err) {
        console.error(`WebpackDevServer listen error =>`, err)
        // reject(err)
        return process.exit()
      }
      console.log(`Listening 8080 success`)
    })

    renderCompiler.hooks.done.tap('doneCallback', (stats) => {
      const compilation = stats.compilation;
      Object.keys(compilation.assets).forEach(key => console.log(chalk.blue(key)));
      compilation.warnings.forEach(key => console.log(chalk.yellow(key)));
      compilation.errors.forEach(key => console.log(chalk.red(`${key}:${stats.compilation.errors[key]}`)));
      console.log(chalk.green(`${chalk.white('渲染进程调试完毕\n')}time:${(stats.endTime - stats.startTime) / 1000} s`));
      resolve(``)
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

    const mainCompiler = webpack(mainConfig)
    let log = ''

    mainCompiler.run((err, stats) => {
      let errorInfo = '';
      if (err) {
        console.log('打包主进程遇到Error！', err.details);
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
          console.log('errorInfo =>', errorInfo)
        } else {
          console.log('打包主进程完毕！', log);
          resolve(log);
        }
      }
    })
  })

}
// 美化输出
function electronLog(data, color) {
    let log = '';
    data.toString().split(/\r?\n/).forEach(line => {
        log += `\n${line}`;
    });
    if (/[0-9A-z]+/.test(log)) {
        console.log(
            chalk[color].bold('┏ Electron -------------------') + 
            log + 
            chalk[color].bold('┗ ----------------------------')
        );
    }
}

/**
 * 启动 electron
 */
const startElectron = () => {
  // 这里启动主进程，所以需要引入的是主进程的配置
  let electronProcess = spawn(electron, [path.join(mainConfig.output.path, mainConfig.output.filename)])
  electronProcess.stdout.on('data', data => {
    // 正常输出为蓝色
    electronLog(data, 'blue');
  });
  electronProcess.stderr.on('data', data => {
    // 错误信息为红色
    electronLog(data, 'red');
  });
}

const build = () => {
  Promise.all([devServer(), buildMain()]).then(() => {
    startElectron()
  }).catch(err => {
    console.error(err)
  })
}

build()