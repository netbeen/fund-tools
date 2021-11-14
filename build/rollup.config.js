// const resolve = require('rollup-plugin-node-resolve')
const babel = require('rollup-plugin-babel')
const { terser } = require('rollup-plugin-terser')

module.exports = (config) => {
  const { input, fileName, name } = config
  return {
    input: {
      input,
      external: ['dayjs', 'axios'],
      plugins: [
        babel({
          exclude: 'node_modules/**'
        }),
        terser()
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
