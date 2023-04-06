/* eslint-disable import/no-extraneous-dependencies */

const { startServer } = require('@coko/server')

const init = async () => {
  try {
    return startServer()
  } catch (e) {
    throw new Error(e)
  }
}

init()
