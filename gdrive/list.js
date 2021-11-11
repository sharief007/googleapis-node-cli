const commander = require("commander")
const google = require("googleapis")
const chalk = require("chalk")
const oauth = require("../auth/oauth")

const list = new commander.Command("list")

const limit = new commander.Option("-l, --limit <limit>","Limit number of results")
const format = new commander.Option("-f, --format <format>","Response format")
                    .choices(["table","json","text"])
                    .default("text","text")
const paramsList = [
    "id","name","mimeType","createdTime","size","webContentLink","appProperties","capabilities","contentHints",
    "contentRestrictions","copyRequiresWriterPermission","description","driveId","explicitlyTrashed","exportLinks",
    "fileExtension","folderColorRgb","fullFileExtension","hasAugmentedPermissions","hasThumbnail","headRevisionId",
    "iconLink","imageMediaMetadata","isAppAuthorized","kind","lastModifyingUser","md5Checksum","modifiedByMe",
    "modifiedByMeTime","modifiedTime","originalFilename","ownedByMe","owners","parents","permissionIds","resourceKey",
    "shared","sharedWithMeTime","sharingUser","shortcutDetails","spaces","starred","teamDriveId","thumbnailLink",
    "thumbnailVersion","trashed","trashedTime","trashingUser","version","videoMediaMetadata","viewedByMe","viewedByMeTime",
    "viewersCanCopyContent"
]
const params = new commander.Option("-p, --params <params...>", "List of parameters").choices(paramsList)

list.addOption(limit)
list.addOption(format)
list.addOption(params)

list.action((options)=>{
    let oauthClient = oauth.getOAuthClient();
    let gDrive = new google.drive_v3.Drive({ auth: oauthClient })

    let listOptions = {}

    if (options["limit"]) {
        listOptions["pageSize"] = parseInt(options["limit"],10)
    }
    if (options["params"]) {
        let str = ""
        options["params"].forEach(p=>{
            str+=","
            str+=p
        })
        str=str.substr(1,str.length-1)
        listOptions["fields"] = `nextPageToken, files(${str})`
    }

    gDrive.files.list(listOptions,(err,res)=>{
        if (err) return console.error("API return an error", chalk.red(err.toString()))
        switch (options["format"]) {
            case "table": console.table(res.data.files)
                            break;
            case "json": console.log(res.data.files)
                            break;
            default: res.data.files.forEach((file,index)=>{
                process.stdout.write(`${chalk.yellow(index)} `,'utf-8')
                for (let prop in file) {
                    process.stdout.write(`${chalk.bold(prop)} : ${chalk.green(file[prop].toString())} `)
                }
                process.stdout.write('\n','utf-8')
            })
        }
    })
})

module.exports = list