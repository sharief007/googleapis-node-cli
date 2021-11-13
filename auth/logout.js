const commander = require("commander")
const chalk = require("chalk")

const fs = require("fs")
const path = require("path")

let command = new commander.Command("logout")
command.action(()=>{
    let p = path.join(process.env.HOMEPATH,".goapis")
    fs.rmdirSync(p,{recursive:true})
    console.log(`Logging off. ${chalk.yellow("Bye")}!`)
})

module.exports = command