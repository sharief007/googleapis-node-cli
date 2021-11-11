const fs = require("fs")
const path = require("path")

const commander = require("commander")

let command = new commander.Command("upload")


command.requiredOption("-f, --file <file>","path of file to upload")

command.action((options)=>{
    fs.stat(path.join(options.file),(err, stats) => {
        console.log(stats)
    })
})

module.exports = command