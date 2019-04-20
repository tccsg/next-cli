const program = require('commander')
const path = require('path')
const chalk = require('chalk')
const inquirer = require('inquirer')
const exists = require('fs').existsSync
const generate = require('../lib/generate')
const download = require('download-git-repo')
const ora = require('ora')

/**
 * 注册一个help的命令
 * 当在终端输入 dg --help 或者没有跟参数的话
 * 会输出提示
 */
program.on('--help', () => {{
  console.log('  Examples:')
  console.log()
  console.log(chalk.gray('    # create a new project with an template'))
  console.log('    $ node bin/next-create.js dgtemplate my-project')
}})

function help () {
  program.parse(process.argv)
  if (program.args.length < 1) return program.help()
}
help()

/**
 * 获取命令行参数
 */
let template = program.args[0] // 命令行第一个参数 模版的名字
const rawName = program.args[1] // 第二个参数 项目目录

/**
 * 获取项目和模版的完整路径
 */
const to = path.resolve(rawName) // 构建的项目的 绝对路径
const tem = path.join(process.cwd(), template) //模版的路径  cwd是当前运行的脚本是在哪个路径下运行

if (exists(to)) {
  inquirer.prompt([
    {
      type: 'confirm',
      message: '当前目录已经存在相同的项目名称，是否继续？',
      name: 'ok'
    }
  ]).then(answers => {
    if (answers.ok) {
      run ()
    }
  })
} else {
  run ()
}

/**
 * run函数则是用来调用generate来构建项目
 */
function run () {
  if (exists(tem)) {
    generate(rawName, tem, to, (err) => {  // 构建完成的回调函数
      if (err) console.log(err)  // 如果构建失败就输出失败原因
    })
  } else {
    const spinner = ora('downloading template')
    spinner.start()
    download(`tccsg/next-template`, tem, err => {
      spinner.stop()
      if (err) return
      console.log(chalk.green(`模版下载完成 ${tem}`))
      generate(rawName, tem, to, (err) => {  // 构建完成的回调函数
        if (err) console.log(err)  // 如果构建失败就输出失败原因
      })
    })
  }
}