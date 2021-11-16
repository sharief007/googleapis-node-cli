const path = require("path")
module.exports= {
    client_id : process.env["GOAPIS_CLIENT_ID"] ? process.env["GOAPIS_CLIENT_ID"] : "415703930570-3d2doffiv67pcr5si50s0npnaqjtdg4l.apps.googleusercontent.com",
    client_secret: process.env["GOAPIS_CLIENT_SECRET"] ? process.env["GOAPIS_CLIENT_SECRET"] : "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",
    redirectUri: process.env["GOAPIS_REDIRECT_URI"] ? process.env["GOAPIS_REDIRECT_URI"] : "urn:ietf:wg:oauth:2.0:oob",
    storagePath: process.env.HOMEPATH ? path.join(process.env.HOMEPATH,".goapis") : path.join(process.env.HOME,".goapis"),
    scopes: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.appdata',
        'https://www.googleapis.com/auth/drive.file',

        'https://www.googleapis.com/auth/contacts',

        'https://www.googleapis.com/auth/contacts.readonly',
        'https://www.googleapis.com/auth/contacts.other.readonly',

        // 'https://www.googleapis.com/auth/userinfo.email',
        // 'https://www.googleapis.com/auth/userinfo.profile',
        // 'https://www.googleapis.com/auth/profile.agerange.read',
        // 'https://www.googleapis.com/auth/profile.language.read',
        // 'https://www.googleapis.com/auth/user.addresses.read',
        // 'https://www.googleapis.com/auth/user.birthday.read',
        // 'https://www.googleapis.com/auth/user.emails.read',
        // 'https://www.googleapis.com/auth/user.gender.read',
        // 'https://www.googleapis.com/auth/user.organization.read',
        // 'https://www.googleapis.com/auth/user.phonenumbers.read',
        // 'https://www.googleapis.com/auth/directory.readonly',
        // 'profile',
        // 'email'
    ]
}