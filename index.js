#!/usr/bin/env node
const commander = require('commander');

const login = require("./auth/login")
const gdrive = require("./gdrive/gdrive")

let command = new commander.Command("goapis");
command.version("0.0.1");


command.addCommand(login)
command.addCommand(gdrive)

command.parse(process.argv)
if (!command.args.length) {
    command.help()
}