const fs = require("fs")
const path = require("path")
const chalk = require("chalk")

const { google } = require("googleapis")
const props = require("../props/properties")

const tokenFile = path.join(props.storagePath,"token.json")

module.exports = {
    getOAuthClient() {
        let oauth = null
        const message = `You are not logged in. Please login to continue.\nUse ${chalk.yellow("goapis login -f <file>")} to login`
        try {
            let token = fs.readFileSync(tokenFile,'utf-8')
            oauth = new google.auth.OAuth2(props.client_id, props.client_secret, props.redirectUri);
            oauth.setCredentials(JSON.parse(token))
            return oauth
        }catch (e){
            console.error(message)
        }
    }
}
