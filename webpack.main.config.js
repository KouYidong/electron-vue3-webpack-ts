const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.config')

const mainConfig = {
  target: 'electron-main'
}

module.exports = merge(baseConfig, mainConfig)