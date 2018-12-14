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

const AWS = require('aws-sdk');
AWS.config.update({region:'us-east-2'});
let sagemakerruntime = new AWS.SageMakerRuntime();
// let sagemaker = new AWS.SageMaker({apiVersion: '2017-07-24'});

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

// Setup our Express pipeline
let app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

/**********************************************************************************************************/

// example call to Sagemaker endpoint
// console.log(names_business);

app.post("/someendpoint", (req, res) => {
	// console.log(req.body.restaurantName.toString().toLowerCase());
	// console.log(names_business['american cafe']);
	let name = req.body.restaurantName.toLowerCase();
	// console.log(names_business[name]);

	let businessId = names_business[req.body.restaurantName.toLowerCase()];
	console.log(businessId);

	let params = {
		Body: businessId,
		EndpointName: '<SageMaker EndpointName>'
	};
	sagemakerruntime.invokeEndpoint(params, function (err, data) {
	  if (err) console.log(err, err.stack); // an error occurred
	  else     console.log(data);           // successful response
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
