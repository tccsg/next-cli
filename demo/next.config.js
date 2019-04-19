
const withLess = require('@zeit/next-less')
const withCss = require('@zeit/next-css')

const withTypescript = require('@zeit/next-typescript')

// module.exports = withTypescript(withLess())
module.exports = withCss(withLess(withTypescript()))