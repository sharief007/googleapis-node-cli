const fs = require("fs")
const path = require("path")
const commander = require("commander")
const google = require("googleapis")
const chalk = require("chalk")
const oauth = require("../auth/oauth")

const pageTokenFile = path.join(process.env.HOMEPATH,".goapis","pageToken.txt")

const list = new commander.Command("list")

const limit = new commander.Option("-l, --limit <limit>","Limit number of results")
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
const params = new commander.Option("-p, --params <params...>", "List of parameters").choices(paramsList)

const nextPage = new commander.Option("-n,--next","Next page")

list.addOption(limit)
list.addOption(format)
list.addOption(params)
list.addOption(nextPage)

list.action((options)=>{
    let oauthClient = oauth.getOAuthClient();
    let drive = new google.drive_v3.Drive({ auth: oauthClient })

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
   if (options["next"] && fs.existsSync(pageTokenFile)) {
       let pageToken = fs.readFileSync(pageTokenFile,'utf-8')
       if (pageToken) {
           listOptions["pageToken"] = pageToken
       }
   }

    drive.files.list(listOptions,(err,res)=>{
        if (err) return console.error("API return an error", chalk.red(err.toString()))
        let filesList = res.data.files
        if (filesList.length) {
            switch (options["format"]) {
                case "table": console.table(filesList)
                    break;
                case "json": console.log(filesList)
                    break;
                default: filesList.forEach((file,index)=>{
                    process.stdout.write(`${chalk.yellow(index)} `,'utf-8')
                    Object.keys(file).forEach(prop=> {
                        process.stdout.write(`${chalk.bold(prop)} : ${chalk.green(file[prop].toString())} `)
                    })
                    process.stdout.write('\n','utf-8')
                })
            }
            fs.createWriteStream(pageTokenFile).write(res.data.nextPageToken,'utf-8')
        } else {
            console.log("No files found")
        }
    })
})

module.exports = list