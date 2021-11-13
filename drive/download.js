const fs = require("fs")
const path = require("path")
const commander = require("commander")
const google = require("googleapis")
const chalk = require("chalk")

const oauth = require("../auth/oauth")

let command = new commander.Command("download")
let id = new commander.Argument("id","file id")
let file = new commander.Argument("file","filename")

command.addArgument(id)
command.addArgument(file)

command.action(async (id,file)=>{
    let outStream = fs.createWriteStream(path.join(file))
    let drive = new google.drive_v3.Drive({
        auth : oauth.getOAuthClient()
    })
    drive.files
        .get({fileId:id, alt: 'media'}, {responseType: 'stream'})
        .then(res => {
            return new Promise((resolve, reject) => {
                res.data
                    .on('end', () => {
                        console.log('Download completed');
                        resolve();
                    })
                    .on('error', err => {
                        console.error('Error downloading file.',chalk.red(err.toString()));
                        reject(err);
                    })
                    .pipe(outStream);
            });
        }).finally(()=>outStream.close())
})

module.exports = command