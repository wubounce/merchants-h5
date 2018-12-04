'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_URL: '"http://192.168.5.60:8089/"'
  // API_URL: '"http://192.168.5.90:8089/"'
  // API_URL: '"https://pre-bmapi.qiekj.com/"'
  // API_URL: '"http://192.168.4.206:8089/"'
})
