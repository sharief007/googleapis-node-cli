const commander = require("commander")
const google = require("googleapis")
const chalk = require("chalk")

const oauth = require("../auth/oauth")
let command = new commander.Command("list")

const limit = new commander.Option("-l, --limit <limit>", "Limit number of results")
const format = new commander.Option("-f,--format <format>","Response format")
    .choices(["table","json","text"])
    .default("text","text")
const paramsList = [
    "addresses","ageRanges","biographies","birthdays","calenderUrls","clientData",
    "coverPhotos","emailAddresses","events","externalIds","genders","imClients",
    "interests","locales","locations","memberships","metadata","miscKeywords",
    "names","nicknames","occupations","organisations","phoneNumbers","photos",
    "relations","sipAddresses","skills","urls","userDefined"
]
const params = new commander.Option("-p,--params <params...>","List of parameters")
                .choices(paramsList)

command.addOption(limit)
command.addOption(params)
command.addOption(format)

command.action((options)=>{
    const oauthClient = oauth.getOAuthClient();
    let service = new google.people_v1.People({
        auth: oauthClient
    })
    service.people.connections.list({
        resourceName: "people/me",
        personFields: options.params ? parseParams(options.params) : "names,emailAddresses,phoneNumbers",
        pageSize: options.limit ? Number(options.limit) : undefined
    },(e,res)=>{
        if (e) return console.error("API returned an error", chalk.red(e.toString()))
        if (options.params) {
            options.format = "json"
        }
        switch (options.format) {
            case "table": console.table(formatResponse(res.data.connections))
                break;
            case "json": console.log(JSON.stringify(res.data.connections,null,1))
                break;
            default: {
                formatResponse(res.data.connections)
                    .forEach((p,index)=>{
                        process.stdout.write(`${chalk.yellow(index)} `,'utf-8')
                        Object.keys(p).forEach(prop=> {
                            process.stdout.write(`${chalk.bold(prop)} : ${chalk.green(p[prop])} `)
                        })
                        process.stdout.write('\n','utf-8')
                    })
            }
        }
    })
})

function parseParams(params) {
    let str = ''
    params.forEach(p=>{
        str +=","
        str+=p
    })
    return str.substr(1,str.length-1)
}

function formatResponse(data) {
    let formattedJson = []
    data.forEach(c=>{
        let formattedObject= {
            id: c.resourceName,
            name: c.names[0].displayName
        }
        if (c.emailAddresses){
            formattedObject["email"] = c.emailAddresses.map(e=> e.value).join(",")
        }
        if (c.phoneNumbers) {
            formattedObject["phone"] = c.phoneNumbers.map(p=>p.value).join(",")
        }
        formattedJson.push(formattedObject)
    })
    return formattedJson
}
module.exports = command