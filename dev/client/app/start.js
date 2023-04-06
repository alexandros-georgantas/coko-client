/**
 * This file (and folder) are only meant to provide a playground for our
 * client. They will not be provided in the package distribution build.
 */

import { startClient } from '../../../src'
import routes from './routes'
import theme from './theme'

// Make sure async functions are supported
/* eslint-disable no-unused-vars */
// const doSomethingAsync = async () => {
//   await console.error('do it')
// }

startClient(routes, theme)
