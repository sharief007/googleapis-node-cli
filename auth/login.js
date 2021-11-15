const fs = require("fs")
const path = require("path")

const chalk = require("chalk")
const inquirer = require("inquirer")
const { google } = require("googleapis")
const commander = require("commander")

const props = require("../props/properties")
const tokenFile = path.join(process.env.HOMEPATH,".goapis","token.json")

let command = new commander.Command("login")
command.action(()=>{
    let oauth = new google.auth.OAuth2(props.client_id, props.client_secret, props.redirectUri);
    getToken(oauth)
})

function getToken(oauthClient) {
    fs.readFile(tokenFile,'utf-8',async (err)=>{
        if (err) await getTokenFromWeb(oauthClient)
        else {
            let promptOptions = {
                type: 'list',
                name: 'reLogin',
                message: 'Already logged in. Do you wish to re-login?',
                choices: ['Yes','No']
            }
            let answer = await inquirer.prompt([promptOptions])
            if (answer['reLogin'] === "Yes") {
                await getTokenFromWeb(oauthClient)
            }
        }
    })
}
async function getTokenFromWeb(oauthClient) {
    const authUrl = oauthClient.generateAuthUrl({ access_type: 'offline', scope: props.scopes })
    console.log("Open this URL to login :", chalk.underline.blue(authUrl))
    let answer = await inquirer.prompt([{name: 'code', message: 'Enter your code :'}])
    oauthClient.getToken(answer['code'],(err,token)=>{
        if (err) return console.error('Error retrieving access token', chalk.red(err.toString()))
        oauthClient.setCredentials(token);
        saveToken(token)
    });
}

function saveToken(token) {
    let p = path.join(process.env.HOMEPATH,".goapis")
    if (!fs.existsSync(p)){
        fs.mkdirSync(p,{recursive:true})
    }
    fs.writeFile(tokenFile, JSON.stringify(token), (err) => {
        if (err) return console.error("Error writing token to file", chalk.red(err.toString()));
            console.log(chalk.green("Login Successful."))
    })
}

module.exports = command