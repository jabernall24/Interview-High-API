
var AWS = require("aws-sdk");

AWS.config.update({accessKeyId: process.env.InterviewHighDynamoDBAccessKeyId, secretAccessKey: process.env.InterviewHighDynamoDBSecretAccessKey, region: process.env.InterviewHighDynamoDBRegion});
const dynamoDB = new AWS.DynamoDB.DocumentClient({apiVersion: "2012-08-10"});

const s3 = new AWS.S3({apiVersion: "2006-03-01"});

const { Client } = require("pg");

const client = new Client(process.env.URL);

client.connect(err => {
	if (err) {
		console.error("connection error", err.stack);
	} else {
		console.log("connected");
	}
});

module.exports = {
	client,
	dynamoDB,
	s3
};