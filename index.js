#!/usr/bin/env node
const commander = require('commander');

const login = require("./auth/login")
const logout = require("./auth/logout")
const drive = require("./drive/drive")
const people = require("./people/people")

let command = new commander.Command("goapis");
command.version("0.0.1");

command.addCommand(login)
command.addCommand(logout)
command.addCommand(drive)
command.addCommand(people)

command.parse(process.argv)
if (!command.args.length) {
    command.help()
}