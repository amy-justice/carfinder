// <!--
// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// PDX-License-Identifier: MIT-0 (For details, see https://github.com/awsdocs/amazon-rekognition-developer-guide/blob/master/LICENSE-SAMPLECODE.)
// -->
// var AWS = require('aws-sdk');
// AWS.config.update({region: 'ap-southeast-2'});

turnersBodyTypes = ['Convertible', 'Wagon', 'Utility', 'Coupe', 'Hatchback', 'Van', 'Sedan', 'SUV', 'Suv', 'Pickup Truck'];


document.getElementById("fileToUpload").addEventListener("change", function (event) {
  ProcessImage();
}, false)
  
  //Calls DetectFaces API and shows estimated ages of detected faces
  async function DetectLabels(imageData) {
    var params = {
      Image: {
        Bytes: imageData
      },
      MaxLabels: 10
    //   Attributes: [
    //     'ALL',
    //   ]
    };

    topResult = await rekogDetectLabels(params);
  }

  async function rekogDetectLabels(params) {
    AWS.region = "us-east-1";
    var rekognition = new AWS.Rekognition();

    rekognition.detectLabels(params, function(err, response) {
      if (err) {
          console.log(err, err.stack); // an error occurred
      } else {
        results = [];
        // console.log(response)
        // console.log(`Detected labels for: ${photo}`)
        response.Labels.forEach(label => {
          if (turnersBodyTypes.includes(label.Name)) {
            results.push(label.Name);
            // console.log(`Label:      ${label.Name}`)
            // console.log(`Confidence: ${label.Confidence}`)
            // console.log("------------")
            // console.log("")
          };
          topResult = results[0];
          turnersSearch(topResult);
          return topResult;
        })
      }
    })
  }

  function turnersSearch(topResult) {
    if (topResult == 'Suv') {
      document.getElementById("opResult").innerHTML = `
        <a target="_blank" href='https://www.turners.co.nz/Cars/Used-Cars-for-Sale/?types=${topResult}&pageno=1&sortorder=7&pagesize=24'>
          Click to search for SUVs on Turners Auctions
        </a>
      `;
    } else if (topResult == 'Pickup Truck') {
      document.getElementById("opResult").innerHTML = `
        <a target="_blank" href='https://www.turners.co.nz/Cars/Used-Cars-for-Sale/?types=utility&pageno=1&sortorder=7&pagesize=24'>
          Click to search for Utility on Turners Auctions
        </a>
      `;
    } else if (!topResult) {
      document.getElementById("opResult").innerHTML = `
      <span style='font-size: 25px;'>🤔</span><br />
      This might not be a car. Please try uploading another image.
      `
    } else {
      document.getElementById("opResult").innerHTML = `
        <a target="_blank" href='https://www.turners.co.nz/Cars/Used-Cars-for-Sale/?types=${topResult}&pageno=1&sortorder=7&pagesize=24'>
          Click to search for ${topResult}s on Turners Auctions
        </a>
      `;
    }
  }

  //Loads selected image and unencodes image bytes for Rekognition DetectFaces API
  function ProcessImage() {
    AnonLog();
    var control = document.getElementById("fileToUpload");
    var file = control.files[0];

    // Load base64 encoded image 
    var reader = new FileReader();
    reader.onload = (function (theFile) {
      return function (e) {
        var img = document.createElement('img');
        var image = null;
        img.src = e.target.result;
        var jpg = true;
        try {
          image = atob(e.target.result.split("data:image/jpeg;base64,")[1]);

        } catch (e) {
          jpg = false;
        }
        if (jpg == false) {
          try {
            image = atob(e.target.result.split("data:image/png;base64,")[1]);
          } catch (e) {
            alert("Not an image file Rekognition can process");
            return;
          }
        }
        //unencode image bytes for Rekognition DetectFaces API 
        var length = image.length;
        imageBytes = new ArrayBuffer(length);
        var ua = new Uint8Array(imageBytes);
        for (var i = 0; i < length; i++) {
          ua[i] = image.charCodeAt(i);
        }
        //Call Rekognition  
        DetectLabels(imageBytes);
      };
    })(file);
    reader.readAsDataURL(file);
  }
  //Provides anonymous log on to AWS services
  function AnonLog() {
    
    // Configure the credentials provider to use your identity pool
    AWS.config.region = 'us-east-1'; // Region
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: 'us-east-1:6800a055-2158-4dcd-ba80-42ab50f99fe9',
    });
    // Make the call to obtain credentials
    AWS.config.credentials.get(function () {
      // Credentials will be available when this function is called.
      var accessKeyId = AWS.config.credentials.accessKeyId;
      var secretAccessKey = AWS.config.credentials.secretAccessKey;
      var sessionToken = AWS.config.credentials.sessionToken;
    });
  }

  // module.exports = rekogDetectLabels;