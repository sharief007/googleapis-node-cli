const fs = require("fs")
const path = require("path")

const chalk = require("chalk")
const inquirer = require("inquirer")
const { google } = require("googleapis")
const commander = require("commander")

const tokenFile = path.join(process.env.HOMEPATH,".goapis","token.json"),
    credentialsFile = path.join(process.env.HOMEPATH,".goapis","credentials.json")
const SCOPES = [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.appdata',
    'https://www.googleapis.com/auth/drive.file',
]

let command = new commander.Command("login")
command.requiredOption("-f, --file <file>", "credentials file with client-id & client-secret")
command.action((options)=>login(options["file"]))

function login(file) {
    fs.readFile(path.join(file),'utf-8',async (err, data) =>{
        if (err) console.log("Error reading file %s",err)
        else {
            const {client_secret, client_id, redirect_uris} = JSON.parse(data)["installed"]
            let oauth = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
            getToken(oauth,data)
        }
    })
}
function getToken(oauthClient, clientCredentials) {
    fs.readFile(tokenFile,'utf-8',async (err,data)=>{
        if (err) await getTokenFromWeb(oauthClient,clientCredentials)
        else {
            let promptOptions = {
                type: 'list',
                name: 'reLogin',
                message: 'Already logged in. Do you wish to re-login?',
                choices: ['Yes','No']
            }
            let answer = await inquirer.prompt([promptOptions])
            answer['reLogin'] === "Yes" ? await getTokenFromWeb(oauthClient,clientCredentials) : oauthClient.setCredentials(JSON.parse(data))
        }
    })
}
async function getTokenFromWeb(oauthClient, clientCredentials) {
    const authUrl = oauthClient.generateAuthUrl({ access_type: 'offline', scope: SCOPES })
    console.log("Open this URL to login :", chalk.underline.blue(authUrl))
    let answer = await inquirer.prompt([{name: 'code', message: 'Enter your code :'}])
    oauthClient.getToken(answer['code'],(err,token)=>{
        if (err) return console.error('Error retrieving access token', chalk.red(err.toString()))
        oauthClient.setCredentials(token);
        saveToken(token,clientCredentials)
    });
}

function saveToken(token,credentials) {
    let p = path.join(process.env.HOMEPATH,".goapis")
    if (!fs.existsSync(p)){
        fs.mkdirSync(p,{recursive:true})
    }
    fs.writeFile(tokenFile, JSON.stringify(token), (err) => {
        if (err) return console.error("Error writing token to file", chalk.red(err.toString()));
        fs.writeFile(credentialsFile,credentials,err=>{
          if (err) return console.error("Error writing token to file", chalk.red(err.toString()))
            console.log(chalk.green("Login Successful."))
        })
    });
}

module.exports = command