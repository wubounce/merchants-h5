module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: 'eslint:recommended',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // check if imports actually resolve
  'settings': {
    'import/resolver': {
      'webpack': {
        'config': 'build/webpack.base.conf.js'
      }
    }
  },
  // add your custom rules here
  //it is base on https://github.com/vuejs/eslint-config-vue
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'indent': 0,
    'eol-last': 0,
    'no-tabs': 0,
    "no-mixed-spaces-and-tabs": 0,
    'semi': ["error", "always"],
    // 禁止使用 console
    // @off console 的使用很常见
    'no-console': 0,
    // // 关闭语句强制分号结尾
    // "semi": [0],
    'no-useless-escape':0,
    'no-unreachable':0,
    'no-undef':0,
    'no-unused-vars':0,
    'no-irregular-whitespace':0
  }
}
