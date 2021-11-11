const commander = require("commander")

const list = require("./list")
const upload = require("./upload")

const gdrive = new commander.Command("gdrive")

gdrive.addCommand(list)
gdrive.addCommand(upload)

module.exports = gdrive