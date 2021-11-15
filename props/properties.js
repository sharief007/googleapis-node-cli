
module.exports= {
    client_id : process.env["GOAPIS_CLIENT_ID"] ? process.env["GOAPIS_CLIENT_ID"] : "415703930570-3d2doffiv67pcr5si50s0npnaqjtdg4l.apps.googleusercontent.com",
    client_secret: process.env["GOAPIS_CLIENT_SECRET"] ? process.env["GOAPIS_CLIENT_SECRET"] : "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",
    redirectUri: process.env["GOAPIS_REDIRECT_URI"] ? process.env["GOAPIS_REDIRECT_URI"] : "urn:ietf:wg:oauth:2.0:oob",
    scopes: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.appdata',
        'https://www.googleapis.com/auth/drive.file',
    ]
}