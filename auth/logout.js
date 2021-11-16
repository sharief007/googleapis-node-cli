const commander = require("commander")
const chalk = require("chalk")
const fs = require("fs")
const props = require("../props/properties")

let command = new commander.Command("logout")
command.action(()=>{
    fs.rmdirSync(props.storagePath,{recursive:true})
    console.log(`Logging off. ${chalk.yellow("Bye")}!`)
})

module.exports = command