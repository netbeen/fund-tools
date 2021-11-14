const resolve = require('rollup-plugin-node-resolve')
const babel = require('rollup-plugin-babel')
const commonjs = require('rollup-plugin-commonjs')
const { terser } = require('rollup-plugin-terser')

module.exports = (config) => {
  const { input, fileName, name } = config
  return {
    input: {
      input,
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
      file: fileName,
      format: 'umd',
      name: name || 'dayjs',
      globals: {
        dayjs: 'dayjs',
        axios: 'axios'
      },
      compact: true
    }
  }
}
