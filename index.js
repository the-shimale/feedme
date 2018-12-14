"use strict";

let path = require("path"),
    express = require("express"),
    bodyParser = require("body-parser");
    // logger = require("morgan"),
    // _ = require("underscore");

const yelp = require('yelp-fusion');
const AWS = require('aws-sdk');

const csv = require('csvtojson');
let fs = require('file-system');
let names_business = require('./data/names_business.json');

AWS.config.update({region:'us-east-2'});
let sagemakerruntime = new AWS.SageMakerRuntime();
// let sagemaker = new AWS.SageMaker({apiVersion: '2017-07-24'});

let port = process.env.PORT ? process.env.PORT : 8080;
let env = process.env.NODE_ENV ? process.env.NODE_ENV : "dev";

/**********************************************************************************************************/

// parse business_names.csv
// let csvFilePath = 'data/business_names.csv';

// csv()
// .fromFile(csvFilePath)
// .then((jsonObj)=>{
//     console.log(jsonObj);
// 	let jsonData = JSON.stringify(jsonObj);
//     fs.writeFile("data/business_names.json", jsonData, function(err) {
// 	    if (err) {
// 	        console.log(err);
// 	    }
// 	});
// })
// let parsedJson = {}
// business_names.forEach(elem => {
// 	parsedJson[elem.name.toLowerCase()] = elem.business_id;
// });

// 	let jsonData = JSON.stringify(parsedJson);
//     fs.writeFile("data/names_business.json", jsonData, function(err) {
// 	    if (err) {
// 	        console.log(err);
// 	    }
// 	});
/**********************************************************************************************************/

// yelp api calls
// const yelpApiKey = 'lBvA1kKyaarH6TEZ85eUgdzBFo1JSypprcLSYS3RrKdJhA9Ql7QFRnK8Nv_OUj8GVownn-K3TAM-UA872KLfEHPfIGWjuzsWaqhQirWzM-Jk6bflIUuzUyTf3bb3WXYx';
// const yelpClient = yelp.client(yelpApiKey);


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
		'Body': businessId,
		EndpointName: '<SageMaker EndpointName>'
	};
	sagemakerruntime.invokeEndpoint(params, function (err, data) {
	  if (err) console.log(err, err.stack); // an error occurred
	  else     console.log(data);           // successful response
	});
});

/**********************************************************************************************************/

// Run the server itself
let server = app.listen(port, () => {
    console.log(`feedme Server Listening: ${server.address().port}`);
});
