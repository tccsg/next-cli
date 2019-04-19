const async = require('async')
const inquirer = require('inquirer')

const promptMapping = {
  string: 'input',
  boolean: 'confirm'
}

module.exports = function ask (prompts, metadate, done) {
  async.eachSeries(Object.keys(prompts), (key, next) => {
    inquirer.prompt([{
      type: promptMapping[prompts[key].type] || prompts[key].type,
      name: key,
      message: prompts[key].message,
      choices: prompts[key].choices || [],
    }]).then(answers => {
      getConfigs(metadate, answers)
      if (typeof answers[key] === 'string') {
        metadate[key] = answers[key].replace(/"/g, '\\"')
      } else {
        metadate[key] = answers[key]
      }
      next()
    }).catch(done)
  }, done)
}

function getConfigs (metadate, answers) {
  const key = Object.keys(answers)[0]
  const prefixIndex = key.indexOf('with')
  const has_Index = key.indexOf('with_')
  if (prefixIndex === 0) {
    if (has_Index === 0) {
      if (answers[key]) {
        metadate.configs.push(`with${answers[key]}`)
      }
    } else {
      if (answers[key]) {
        metadate.configs.push(key)
      }
    }
  }
}