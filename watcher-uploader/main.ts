
const chokidar = require('chokidar');

import * as AWS from 'aws-sdk';

import * as fs from 'fs';

import { log } from  './lib/logger';

require('dotenv').config();

function uploadToS3(filepath) {

  var s3 = new AWS.S3();

  let filename = filepath.split("/")

  filename = filename[filename.length - 1];

  fs.readFile(filepath, (err, data) => {
    if (err) throw err;

    const params = {
      Bucket: 'capitalinterest/uploads',
      Key: filename,
      Body: data,
      ACL: 'public-read'
    };

    log.info('audio.uploading.s3', filename);
    log.info(filename);

    s3.upload(params, function(s3Err, data) {

      if (s3Err) throw s3Err

      log.info('audio.uploaded.s3', data.Location);
      log.info(data.Location);

    });

  });

}

var startupWaitComplete = false;

setTimeout(() => {

  startupWaitComplete = true;

  log.info('startup complete, ready to monitor and upload new records');

}, 10000);

let traktorRecordingsDirectory =  process.env.RECORDINGS_DIRECTORY || '/Users/zyler/Music/Traktor/Recordings';

log.info(`monitoring ${traktorRecordingsDirectory} for new records`);

// One-liner for current directory, ignores .dotfiles
chokidar.watch(traktorRecordingsDirectory, {
  ignored: /(^|[\/\\])\../,
  awaitWriteFinish: true
})
.on('all', async (event, path) => {

  if (startupWaitComplete) {

    log.info(event, path);

    if (event === 'add' || event === 'change') {

      uploadToS3(path);

    }

  }

});
