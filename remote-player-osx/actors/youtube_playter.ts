
import { Actor } from 'bunnies';

import { exec } from 'child_process';

export async function start() {

  Actor.create({

    exchange: 'zeiler.io',

    routingkey: 'playYoutube',

    queue: 'playYoutubeOnMac'

  })
  .start((channel, msg) => {

    console.log(msg.content.toString());

    exec(`open -a Safari ${msg.content.toString()}`);

    channel.ack(msg);

  });

}

if (require.main === module) {

  start();

}

