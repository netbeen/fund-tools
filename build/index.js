/* eslint-disable max-len */
const rollup = require('rollup')
const configFactory = require('./rollup.config')
const util = require('util')
const { ncp } = require('ncp')

const { promisify } = util

async function build(option) {
  const bundle = await rollup.rollup(option.input)
  await bundle.write(option.output)
}

(async () => {
  try {
    build(configFactory({
      input: './src/index.js',
      fileName: './index.min.js'
    }))
    await promisify(ncp)('./types/', './')
  } catch (e) {
    console.error(e) // eslint-disable-line no-console
  }
})()
