/* eslint-disable max-len */
const rollup = require('rollup')
const util = require('util')
const { ncp } = require('ncp')
const configFactory = require('./rollup.config')

const { promisify } = util

async function build(option) {
  const bundle = await rollup.rollup(option.input)
  await bundle.write(option.output)
}

(async () => {
  try {
    build(configFactory())
    await promisify(ncp)('./types/', './')
  } catch (e) {
    console.error(e) // eslint-disable-line no-console
  }
})()
