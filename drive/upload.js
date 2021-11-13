const fs = require("fs")
const path = require("path")

const commander = require("commander")
const chalk = require("chalk")
const google = require("googleapis")

const oauth = require("../auth/oauth")


let command = new commander.Command("upload")
let folder = new commander.Option("-p, --folder <folder>","parent folder id to which file to be uploaded")

command.requiredOption("-f, --file <file>","path of file to upload")
command.requiredOption("-n, --name <name>","file name")
command.requiredOption("-t, --mime <type>","mime type of the file")
command.addOption(folder)

command.action((options)=>{
    let oauthClient = oauth.getOAuthClient();
    let drive = new google.drive_v3.Drive({ auth: oauthClient })
    let resource = { name: options["name"] }
    if (options["folder"]){
        resource["parents"] = [options["folder"]]
    }
    let media = {
        mimeType : options["type"],
        body: fs.createReadStream(path.join(options["file"]))
    }
    drive.files.create({resource, media}).then(res =>{
        console.log("File upload Successful. File id", chalk.bold.yellow(res.data["id"]))
    }).catch(e=>console.error("API returned an error",chalk.red(e.toString())))
})

module.exports = command