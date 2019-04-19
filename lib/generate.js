const Metalsmith = require('metalsmith')
const Handlebars = require('handlebars')
const path = require('path')
const chalk = require('chalk')
const getOptions = require('./options')
const ask = require('./ask')
const filter = require('./filter')


Handlebars.registerHelper('if_eq', function(a, b, opts) {
  return a === b
    ? opts.fn(this)
    : opts.inverse(this)
})
Handlebars.registerHelper('configeach', function(items, opts) {
  let _tem = ''
  items.forEach(item => {
    _tem += `${item}(`
  })
  for (let i = 0; i < items.length; i++) {
    _tem += ')'
  }
  return _tem
})
module.exports = function generate (name, tem, dest, done) {
  const opts = getOptions(name, tem)
  const metalsmith = Metalsmith(path.join(tem, 'template'))
  const data = Object.assign(metalsmith.metadata(), {
    destDirName: name,
    inPlace: dest === process.cwd(),
    configs: []
  })
  metalsmith.use(askQuestions(opts.prompts))
    .use(filterFiles(opts.filters))
    .use(renderTemplateFiles())

  metalsmith.clean(false)
    .source('.')
    .destination(dest)
    .build((err, files) => {
      done(err)
      if (typeof opts.complete === 'function') {
        const helpers = { chalk }
        opts.complete(data, helpers)
      } else {
        console.log('complete is not a function')
      }
    })
}

function askQuestions (prompts) {
  return (fils, ms, done) => {
    ask(prompts, ms.metadata(), done)
  }
}
function filterFiles (filters) {
  return (files, metalsmith, done) => {
    filter(files, filters, metalsmith.metadata(), done)
  }
}


function renderTemplateFiles () {
  return (files, ms, done) => {
    const keys = Object.keys(files)
    const metadate = ms.metadata()
    keys.forEach(key => {
      const str = files[key].contents.toString()
      let t = Handlebars.compile(str)
      let html = t(metadate)
      files[key].contents = new Buffer.from(html)
    })
    done()
  }
}