#!/usr/bin/env ts-node

require('dotenv').config();

import * as program from 'commander';

import * as datapay from 'datapay';

// txid: b134304d14c0f1eac37c2dc21f8abd600c5959e557fa08676975b1ca2e5b4ca0
// title: "Capital Interest Radio Show Nov 17, 2019"
// filename: "Capital_Interest_Radio_Show_Nov_17_2019.mp3"
// filetype: mp3
// duration: 1800000
/*
./bin/bitcom.ts publishepisode \
b134304d14c0f1eac37c2dc21f8abd600c5959e557fa08676975b1ca2e5b4ca0 \
"Capital Interest Radio Show Nov 17, 2019" \
filename: "Capital_Interest_Radio_Show_Nov_17_2019.mp3" \
mp3 \
1800000
 */


program
  .command('publishepisode <txid> <title> <filename> <filetype> <duration>')
  .action(async (txid, title, filename, filetype, duration) => {

    const privateKey = process.env.BITCOM_PRIV;
    const bitcom = process.env.BITCOM;

    console.log('privkey',privateKey);
    console.log('bitcom',bitcom);

    var data = [
      "1HSbJWmeWan2PGTJ2zJjztSsZGXK7KF5N4", // capitalinterestradio.com bitcom address
      txid,
      title,
      filename,
      filetype,
      duration
    ];

    console.log(data);

    try {

      let result = await datapay.send({
        safe: true,
        data,
        pay: { key: privateKey }
      });

      console.log('result', result);

    } catch(error) {

      console.error(error.message);

    }

  });

program.parse(process.argv);

