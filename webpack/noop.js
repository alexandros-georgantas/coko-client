/**
 * A module that does nothing. Use this as a fallback for files that are
 * optional in webpack's config.
 */

// This can be useful to see if this module actually got used
// const noop = (() => console.log('the noop!'))()

const noop = {}

module.exports = noop
