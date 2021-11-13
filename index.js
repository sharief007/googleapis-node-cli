#!/usr/bin/env node
const commander = require('commander');

const login = require("./auth/login")
const logout = require("./auth/logout")
const drive = require("./drive/drive")

let command = new commander.Command("goapis");
command.version("0.0.1");


command.addCommand(login)
command.addCommand(logout)
command.addCommand(drive)

command.parse(process.argv)
if (!command.args.length) {
    command.help()
}