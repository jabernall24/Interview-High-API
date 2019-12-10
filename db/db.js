
var AWS = require("aws-sdk");

AWS.config.update({accessKeyId: process.env.InterviewHighDynamoDBAccessKeyId, secretAccessKey: process.env.InterviewHighDynamoDBSecretAccessKey, region: process.env.InterviewHighDynamoDBRegion});
var dynamoDB = new AWS.DynamoDB({apiVersion: "2012-08-10"});

const { Client } = require("pg");

const client = new Client(process.env.URL);

client.connect(err => {
	if (err) {
		console.error("connection error", err.stack);
	} else {
		console.log("connected");
	}
});

// dynamoDB.connect(err => {
// 	if(err)
// 	{
// 		console.log("connection error Dynamodb", err.stack)
// 	}
// 	else{
// 		console.log("connected Dynamodb");
// 	}
// });

module.exports = {
	client,
	dynamoDB
};