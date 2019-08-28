
var RSS = require('rss');

var feed = new RSS({

  title: 'Capital Interest',

  description: 'House Music Sets',

  image_url: 'https://s3.amazonaws.com/upload.zeiler.io/capital_interest.jpg',

  custom_elements: [
    {'itunes:author': 'Capital Z'},
    {'itunes:category': 'Performing Arts'},
    {'itunes:explicit': false},
    {'itunes:language': 'english' }
  ]

});

feed.item({

  title: 'Capital Interest Saturdays @ The Banke 18/05/2019',

  description: 'Saturday Morning Mix Practice',

  url: 'https://s3.amazonaws.com/capitalinterest/uploads/AdamCmielHipHopMix-Part0-2019-05-13_19h36m24.mp3',

  guid: 'eb643727-35e9-45f2-908e-f319a2c7b6e2',

  enclosure: {
    url: 'https://s3.amazonaws.com/capitalinterest/uploads/AdamCmielHipHopMix-Part0-2019-05-13_19h36m24.mp3',
    type: 'audio/mp3'
  }

})

'use strict';

const Hapi = require('@hapi/hapi');

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: '0.0.0.0',
        routes: {
          cors: true
        }
    });

    server
      .route({
        path: "/rss/feed",
        method: "GET",
        config: {

          handler: (req, h) => {

            return feed.xml();

          }

        }
      })



    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();

