# googleapis-node-cli

This is a command line application written in node.js to consume popular google APIs.
### Demo
![Demo](./demo.gif)

### Installation
Make sure you have node & npm installed on your machine.
```shell
# clone the github repository
git clone https://github.com/sharief007/googleapis-node-cli.git

cd googleapis-node-cli

# install node dependencies
npm install

# globally install the goapis command
npm install -g .

# test the command
goapis --help
```
### Creating executable binary file
```shell
npm install -g pkg

# cd into project directory
pkg .   
# this will create executable file 
# run pkg --help for more info
```
### Usage
#### List files & folders
```shell
# print 5 files/folders from google drive
goapis drive list -f table -l 5 -p id name mimeType size

# print next 5 files/folders from google drive
goapis drive list -nl 5
```
#### Upload file
```shell
goapis drive upload -f <filepath> -n <fileName> -t <mimeType> -p <parentFolderId>
```
#### Download file
```shell
goapis drive download <id> <filename>
```
#### Delete file/folder
```shell
goapis drive delete <id>
```

### TODOs
1. ~~Support for Google Drive API~~
2. Support for Google people API
3. Support for Gmail API