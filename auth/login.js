const fs = require("fs")
const path = require("path")

const chalk = require("chalk")
const inquirer = require("inquirer")
const { google } = require("googleapis")
const commander = require("commander")

const oauth = require("./oauth")

const tokenFile = "token.json"
const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];

let command = new commander.Command("login")
command.requiredOption("-f, --file <file>", "credentials file with client-id & client-secret")
command.action((options)=>login(options["file"]))
// command.action((options)=>console.log(oauth.getOAuthClient()))

function login(file) {
    fs.readFile(path.join(file),'utf-8',(err, data) =>{
        if (err) console.log("Error reading file %s",err)
        else {
            const {client_secret, client_id, redirect_uris} = JSON.parse(data)["installed"]
            let oauth = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
            getToken(oauth)
        }
    })
}
function getToken(oauthClient) {
    fs.readFile(tokenFile,'utf-8',async (err,data)=>{
        if (err) await getTokenFromWeb(oauthClient)
        else {
            let promptOptions = {
                type: 'list',
                name: 'reLogin',
                message: 'Already logged in. Do you wish to re-login?',
                choices: ['Yes','No']
            }
            let answer = await inquirer.prompt([promptOptions])
            answer['reLogin'] === "Yes" ? await getTokenFromWeb(oauthClient) : oauthClient.setCredentials(JSON.parse(data))
        }
    })
}
async function getTokenFromWeb(oauthClient) {
    const authUrl = oauthClient.generateAuthUrl({ access_type: 'offline', scope: SCOPES })
    console.log("Open this URL to login :", chalk.underline.blue(authUrl))
    let answer = await inquirer.prompt([{name: 'code', message: 'Enter your code :'}])
    oauthClient.getToken(answer['code'],(err,token)=>{
        if (err) return console.error('Error retrieving access token', chalk.red(err.toString()))
        oauthClient.setCredentials(token);
        fs.writeFile(tokenFile, JSON.stringify(token), (err) => {
            if (err) return console.error(err);
            console.log(chalk.green("Login Successful"));
        });
    });
}

module.exports = command