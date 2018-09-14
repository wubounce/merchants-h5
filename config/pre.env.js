'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"preview"',

  API_URL: '"http://pre.api.qiekj.com/merchant/"'
})
