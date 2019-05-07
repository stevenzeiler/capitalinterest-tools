import * as AWS from 'aws-sdk';

export async function sendEmail(url) {

  let recipient = 'me@stevenzeiler.com';

  var params = {
    Destination: { /* required */
      CcAddresses: [
        'thederrickj@gmail.com'
      ],
      ToAddresses: [
        recipient
      ]
    },
    Message: { /* required */
      Body: { /* required */
      Html: {
       Charset: "UTF-8",
        Data: `Capital Interest's Traktor Kontroler Produced A New Record: <a href="${url}">${url}</a>`
      },
      Text: {
       Charset: "UTF-8",
        Data: `Capital Interest's Traktor Kontroler Produced A New Record: ${url}`
      }
     },
     Subject: {
      Charset: 'UTF-8',
      Data: 'Capital Interest Traktor New Recording'
     }
    },
    Source: 'capitalinterest@anypay.global'
  };

// Create the promise and SES service object
  var sendPromise = new AWS.SES({region: 'us-east-1', apiVersion: '2010-12-01'}).sendEmail(params).promise();

  // Handle promise's fulfilled/rejected states
  sendPromise.then(
    function(data) {
      console.log(data.MessageId);
    }).catch(
      function(err) {
      console.error(err, err.stack);
    });
}
