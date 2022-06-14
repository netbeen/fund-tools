const resolve = require('rollup-plugin-node-resolve')
const babel = require('rollup-plugin-babel')
const commonjs = require('rollup-plugin-commonjs')
const { terser } = require('rollup-plugin-terser')

module.exports = () => ({
  input: {
    input: './src/index.js',
    external: ['dayjs', 'axios'],
    plugins: [
      resolve({}),
      babel({
        exclude: 'node_modules/**'
      }),
      terser(),
      commonjs()
    ]
  },
  output: {
    file: './index.min.js',
    format: 'umd',
    name: 'fundTools',
    globals: {
      dayjs: 'dayjs',
      axios: 'axios'
    },
    compact: true
  }
})
