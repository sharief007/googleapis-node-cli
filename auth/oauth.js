const fs = require("fs")
const path = require("path")
const chalk = require("chalk")

const { google } = require("googleapis")
const tokenFile = path.join(process.env.HOMEPATH,".goapis","token.json")
const credentialsFile = path.join(process.env.HOMEPATH,".goapis","credentials.json")

module.exports = {
    getOAuthClient() {
        let oauth = null
        const message = `You are not logged in. Please login to continue.\nUse ${chalk.yellow("goapis login -f <file>")} to login`
        try {
            let credentials = fs.readFileSync(credentialsFile,'utf-8')
            let token = fs.readFileSync(tokenFile,'utf-8')
            const {client_secret, client_id, redirect_uris} = JSON.parse(credentials)["installed"]
            oauth = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
            oauth.setCredentials(JSON.parse(token))
            return oauth
        }catch (e){
            console.error(message)
        }
    }
}
