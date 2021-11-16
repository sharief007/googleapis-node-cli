const commander = require("commander")

const list = require("./list")
let people = new commander.Command("people")

people.addCommand(list)

module.exports = people