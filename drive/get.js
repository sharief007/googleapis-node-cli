const commander = require("commander")
const google = require("googleapis")
const chalk = require("chalk")

const oauth = require("../auth/oauth")

let command = new commander.Command("get")
let id = new commander.Argument("id","file/folder id")
const format = new commander.Option("-f, --format <format>","Response format")
            .choices(["table","json","text"])
            .default("text","text")
const paramsList = [
    "id","name","mimeType","createdTime","size","webContentLink","webViewLink","appProperties","capabilities","contentHints",
    "contentRestrictions","copyRequiresWriterPermission","description","driveId","explicitlyTrashed","exportLinks",
    "fileExtension","folderColorRgb","fullFileExtension","hasAugmentedPermissions","hasThumbnail","headRevisionId",
    "iconLink","imageMediaMetadata","isAppAuthorized","kind","lastModifyingUser","md5Checksum","modifiedByMe",
    "modifiedByMeTime","modifiedTime","originalFilename","ownedByMe","owners","parents","permissionIds","resourceKey",
    "shared","sharedWithMeTime","sharingUser","shortcutDetails","spaces","starred","teamDriveId","thumbnailLink",
    "thumbnailVersion","trashed","trashedTime","trashingUser","version","videoMediaMetadata","viewedByMe","viewedByMeTime",
    "viewersCanCopyContent"
]
let params = new commander.Option("-p, --params <params...>","List of parameters")
                .choices(paramsList)

command.addArgument(id)
command.addOption(format)
command.addOption(params)

command.action((id,options)=>{
    let oauthClient = oauth.getOAuthClient();
    let drive = new google.drive_v3.Drive({ auth: oauthClient })

    let listOptions = {fileId : id}
    if (options["params"]) {
        let str = ""
        options["params"].forEach(p=>{
            str+=","
            str+=p
        })
        str=str.substr(1,str.length-1)
        listOptions["fields"] = str
    }
    drive.files.get(listOptions,(err,res)=>{
        if (err) return console.error("API return an error", chalk.red(err.toString()))
        if (res.data) {
            switch (options["format"]) {
                case "table": console.table(res.data)
                    break;
                case "json": console.log(res.data)
                    break;
                default:
                    Object.keys(res.data).forEach(prop=> {
                        process.stdout.write(`${chalk.bold(prop)} : ${chalk.green(res.data[prop].toString())} `)
                    })
                    process.stdout.write('\n','utf-8')
            }
        } else {
            console.log("No files found")
        }
    })
})

module.exports = command