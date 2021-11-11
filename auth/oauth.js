const fs = require("fs")
const path = require("path")
const chalk = require("chalk")

const { google } = require("googleapis")
const tokenFile = 'token.json'
const credentialsFile = 'credentials.json'

module.exports = {
    getOAuthClient() {
        let oauth = null
        const message = `You are not logged in. Please login to continue.\nUse ${chalk.yellow("goapis login -f <file>")} to login`
        try {
            let credentials = fs.readFileSync(path.join(credentialsFile),'utf-8')
            let token = fs.readFileSync(path.join(tokenFile),'utf-8')
            const {client_secret, client_id, redirect_uris} = JSON.parse(credentials)["installed"]
            oauth = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
            oauth.setCredentials(JSON.parse(token))
        }catch (e){
            console.error(message)
        }
        finally {
            return oauth
        }
    }
}
