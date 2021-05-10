const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.config')

const renderConfig = {
  target: 'electron-renderer'
}

module.exports = merge(baseConfig, renderConfig)