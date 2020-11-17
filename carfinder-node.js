//Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
//PDX-License-Identifier: MIT-0 (For details, see https://github.com/awsdocs/amazon-rekognition-developer-guide/blob/master/LICENSE-SAMPLECODE.)


// Load the SDK and UUID
var AWS = require('aws-sdk');
AWS.config.update({region: 'ap-southeast-2'});
var async = require("async"); 


const bucket = 'amyj-mrhq' // the bucketname without s3://
const photo  = '2020-lamborghini-huracan-evo-Autocar-6.jpg' // the name of file

const turnersBodyTypes = ['Convertible', 'Wagon', 'Utility', 'Coupe', 'Hatchback', 'Van', 'Sedan', 'SUV', 'Suv', 'Pickup Truck'];
let results = [];

const config = new AWS.Config({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
}) 

const client = new AWS.Rekognition();
const params = {
  Image: {
    S3Object: {
      Bucket: bucket,
      Name: photo
    },
  },
  MaxLabels: 10
}

function rekogDetectLabels() {
  return new Promise(resolve => {
    client.detectLabels(params, function(err, response) {
      if (err) {
        console.log(err, err.stack); // an error occurred
      } else {
        // console.log(`Detected labels for: ${photo}`)
        response.Labels.forEach(label => {
          if (turnersBodyTypes.includes(label.Name)) {
            results.push(label.Name);
          }
        }) // for response.labels
      } // if
      resolve(results[0])
    })
  })
}

async function carfinder(params) {
  const result = await rekogDetectLabels()

  return result;
}

carfinder(params);

module.exports = carfinder;
