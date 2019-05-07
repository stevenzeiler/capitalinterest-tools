"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chokidar = require('chokidar');
const AWS = require("aws-sdk");
const fs = require("fs");
const logger_1 = require("./lib/logger");
require('dotenv').config();
function uploadToS3(filepath) {
    var s3 = new AWS.S3();
    let filename = filepath.split("/");
    filename = filename[filename.length - 1];
    logger_1.log.info('filepath', filepath);
    logger_1.log.info('filename', filename);
    fs.readFile(filepath, (err, data) => {
        if (err)
            throw err;
        const params = {
            Bucket: 'capitalinterest/uploads',
            Key: filename,
            Body: data,
            ACL: 'public-read'
        };
        logger_1.log.info('uploading file to amazon s3');
        logger_1.log.info('audio.uploading', filename);
        s3.upload(params, function (s3Err, data) {
            if (s3Err)
                throw s3Err;
            logger_1.log.info(`File uploaded successfully at ${data.Location}`);
            logger_1.log.info('audio.uploaded', data.Location);
        });
    });
}
var startupWaitComplete = false;
setTimeout(() => {
    startupWaitComplete = true;
    logger_1.log.info('startup complete, ready to monitor and upload new records');
}, 10000);
// One-liner for current directory, ignores .dotfiles
chokidar.watch('/Users/zyler/Music/Traktor/Recordings', {
    ignored: /(^|[\/\\])\../,
    awaitWriteFinish: true
})
    .on('all', (event, path) => __awaiter(this, void 0, void 0, function* () {
    if (startupWaitComplete) {
        logger_1.log.info(event, path);
        if (event === 'add' || event === 'change') {
            uploadToS3(path);
        }
    }
}));
//# sourceMappingURL=main.js.map