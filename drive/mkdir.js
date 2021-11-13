const commander = require("commander")

const google = require("googleapis")
const chalk = require("chalk")

const oauth = require("../auth/oauth")

let command = new commander.Command("mkdir")
let dirName = new commander.Argument("dirName","Name of the folder/directory")
let parent = new commander.Option("-p, --folder <folder>","parent folder id")

command.addArgument(dirName)
command.addOption(parent)

command.action((dirName,options)=>{
    let metadata = {
        name : dirName,
        mimeType: "application/vnd.google-apps.folder"
    }
    if (options["folder"]){
        metadata["parents"] = [options["folder"]]
    }
    let drive = new google.drive_v3.Drive({
        auth : oauth.getOAuthClient()
    })
    drive.files.create({
        resource: metadata,
        fields: "id"
    }).then(res=>{
        console.log("Folder created. Folder id: ",chalk.bold.yellow(res.data["id"]))
    }).catch(e=>console.error("API returned an error",chalk.red(e.toString())))
})

module.exports = command