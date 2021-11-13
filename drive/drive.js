const commander = require("commander")

const list = require("./list")
const upload = require("./upload")
const  mkdir = require("./mkdir")
const get = require("./get")
const download = require("./download")
const del = require("./delete")

const drive = new commander.Command("drive")
drive.addCommand(list)
drive.addCommand(upload)
drive.addCommand(mkdir)
drive.addCommand(get)
drive.addCommand(download)
drive.addCommand(del)

module.exports = drive