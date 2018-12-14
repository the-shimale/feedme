"use strict";

let path = require("path"),
    express = require("express"),
    bodyParser = require("body-parser"),
    fs = require('file-system');
    // logger = require("morgan"),
    // _ = require("underscore");

const csv = require('csvtojson');
let names_business = require('./data/names_business.json');
// let business_names = require('./data/business_names.json');
let user_reviews = require('./data/reviewsByUser.json');
let user_trained = require('./data/convertTrainUsers.json');
let business_trained = require('./data/convertTrainBusinesses.json');

const AWS = require('aws-sdk');
AWS.config.region = 'us-east-2';
AWS.config.loadFromPath('./data/rootkey.json');
// AWS.config.credentials = new AWS.CognitoIdentityCredentials({
//   IdentityId: 'us-east-2:09e2177a-e9c3-4095-b2fc-8e97f5a1eb08'
// });
// AWS.config.credentials.get(function(err) {
//   if (err) console.log(err);
//   else console.log(AWS.config.credentials);
// });
// AWS.config.update({region:'us-east-2'});
let sagemakerruntime = new AWS.SageMakerRuntime();

let port = process.env.PORT ? process.env.PORT : 8080;
let env = process.env.NODE_ENV ? process.env.NODE_ENV : "dev";

/**********************************************************************************************************/
 // parse business_names.csv
// let csvFilePath = 'data/business_names.csv';
//  csv()
// .fromFile(csvFilePath)
// .then((jsonObj)=>{
//     console.log(jsonObj);
// 	let jsonData = JSON.stringify(jsonObj);
//     fs.writeFile("data/business_names.json", jsonData, function(err) {
// 	    if (err) {
// 	        console.log(err);
// 	    }
// 	});
// });

// let parsedJson = {}
// business_names.forEach(elem => {
// 	parsedJson[elem.name.toLowerCase()] = elem.business_id;
// });
//  	let jsonData = JSON.stringify(parsedJson);
//     fs.writeFile("data/names_business.json", jsonData, function(err) {
// 	    if (err) {
// 	        console.log(err);
// 	    }
// 	});

/**********************************************************************************************************/

// create request payload for sagemaker endpoint
  let dataElement = [];
  // initialize dataElement vector to all 0's
  for (let i = 0; i < 247848; ++i) {
  	dataElement.push(0);
  };


/**********************************************************************************************************/

// Setup our Express pipeline
let app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

/**********************************************************************************************************/

// example call to Sagemaker endpoint

// user inputs user_id, business name
// lookup business_id
// use user_id, business_id to lookup unique INT in magic.json
// genereate array of ints for 
// use unique INT to find 
app.post("/endpoint", (req, res) => {
	let businessId = names_business[req.body.restaurantName.toLowerCase()];

	let userIndex = user_trained[req.body.username];
	let businessIndex = business_trained[businessId];

	// update dataElement at indecies 
	dataElement[userIndex] = 1;
	dataElement[businessIndex] = 1;

	let request = {
    	"instances": [
	    	{ "features": dataElement }
	  	]
	};
	let instances =	[{ "features": dataElement }];

	let params = {
		Body: Buffer.from(JSON.stringify(request)),
		EndpointName: 'factorization-machines-2018-12-14-06-45-48-339',
		ContentType: 'application/json'
	};
	sagemakerruntime.invokeEndpoint(params, function (err, data) {
	  if (err) console.log(err, err.stack); // an error occurred
	  else     res.status(200).send(JSON.parse(Buffer.from(data.Body).toString('utf8')));           // successful response
	});
});


// get call to receive user reviews
app.get("/v1/user/:username", (req, res) => {
	let username = req.params.username;
	let reviewArray = user_reviews[username];
	if (reviewArray) {
		res.status(200).send(reviewArray);
	} else {
		res.status(404).send({ error: "unknown user" });
	}
});


/**********************************************************************************************************/

// Run the server itself
let server = app.listen(port, () => {
    console.log(`feedme Server Listening: ${server.address().port}`);
});
