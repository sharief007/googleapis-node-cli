const google = require("googleapis")
const commander = require("commander")
const chalk = require("chalk")
const oauth = require("../auth/oauth")

let command = new commander.Command("delete")
let id = new commander.Argument("id","File/Folder id")

command.addArgument(id)
command.action((id)=>{
    let oauthClient = oauth.getOAuthClient();
    let drive = new google.drive_v3.Drive({ auth: oauthClient })
    drive.files.delete({
        fileId: id
    },(err)=>{
        if (err) return console.error("API returned an error",chalk.red(err.toString()))
        console.log("File/Folder deleted")
    })
})

module.exports = command