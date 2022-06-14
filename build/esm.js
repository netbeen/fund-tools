const util = require('util')
const { ncp } = require('ncp')

const { promisify } = util;

(async () => {
  try {
    await promisify(ncp)('./types/', './esm')
  } catch (e) {
    console.error(e) // eslint-disable-line no-console
  }
})()
