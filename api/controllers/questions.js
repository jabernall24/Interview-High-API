const client = require("../../db/db").client;
const s3 = require("../../db/db").s3;

function readFile(filename, cb) {		
	const fs = require("fs");
	fs.readFile(filename, function read(err, data) {
		if (err) {
			cb(err);
		}
		
		cb(data);
	});
}

exports.create_new_question = async function(req, res) {

	let title = req.body.title;
	let category = req.body.category;
	let subcategory = req.body.subcategory;
	let difficulty = req.body.difficulty;
	let company = req.body.company;
	let rating = 0;
	let rating_counter = 0;

	if(title == undefined || title == ""
	|| category == undefined || category == ""
	|| subcategory == undefined || subcategory == ""
	|| difficulty == undefined || difficulty == ""
	|| company == undefined || company == ""){
		return res.status(400).json({"success": false, "message": "Information missing need all"});
	}

	let queryString = "INSERT INTO question(title, category, subcategory, difficulty, company, rating, rating_counter) values($1::text, $2::text, $3::text, $4::int, $5::text, $6::int, $7::int) RETURNING *;";
	let queryValues = [title, category, subcategory, difficulty, company, rating, rating_counter];

	await client
		.query(queryString, queryValues)
		.then(result => {

			const starterFilePath = req.files.starter.tempFilePath;
			const questionFilePath = req.files.question.tempFilePath;
			const answerFilePath = req.files.answer.tempFilePath;
			const testFilePath = req.files.tests.tempFilePath;

			const BUCKET_NAME = "interview-high";

			readFile(starterFilePath, function(starterData) {
				readFile(questionFilePath, function(questionData) {
					readFile(answerFilePath, function(answerData) {
						readFile(testFilePath, function(testsData) {
							let params = {
								Bucket: BUCKET_NAME,
								Key: "Questions/" + result.rows[0]["question_id"] + "/starter.cpp", // File name you want to save as in S3
								Body: starterData
							};
						
							s3.upload(params, function(err) {
								if (err) {
									return res.status(400).json(err);
								}
							});

							params = {
								Bucket: BUCKET_NAME,
								Key: "Questions/" + result.rows[0]["question_id"] + "/question.txt", // File name you want to save as in S3
								Body: questionData
							};

							s3.upload(params, function(err) {
								if (err) {
									return res.status(400).json(err);
								}
							});


							params = {
								Bucket: BUCKET_NAME,
								Key: "Questions/" + result.rows[0]["question_id"] + "/answer.cpp", // File name you want to save as in S3
								Body: answerData
							};

							s3.upload(params, function(err) {
								if (err) {
									return res.status(400).json(err);
								}
							});


							params = {
								Bucket: BUCKET_NAME,
								Key: "Questions/" + result.rows[0]["question_id"] + "/tests.cpp", // File name you want to save as in S3
								Body: testsData
							};

							s3.upload(params, function(err) {
								if (err) {
									return res.status(400).json(err);
								}
								return res.status(200).json({
									"question_id": result.rows[0]["question_id"]
								});
							});				
						});
					});
				});
			});
		})
		.catch(e => {
			console.log(e);
			const response = [
				{
					"success": false,
					"message": e
				},
				{
					"question_id": null
				}
			];

			return res.status(400).json(response);
		});
};

exports.get_questions = async function(req, res) {
	let company = req.params.company;

	let queryString = "SELECT * FROM question WHERE company = $1::text;";
	let values = [company];

	await client
		.query(queryString, values)
		.then(result => {

			let response = [
				{
					"success": true,
					"message": ""
				},
				result.rows
			];

			return res.status(200).json(response);
		})
		.catch(e => {
			return res.status(400).json(e);
		});
};

exports.delete_question = async function(req, res) {
	let question_id = req.params.question_id;

	let queryString = "DELETE FROM question WHERE question_id=$1::int RETURNING question_id;";
	let values = [question_id];

	await client
		.query(queryString, values)
		.then(result => {
			if(result.rows.length == 0) {
				return res.status(400).json([
					{
						"success": false,
						"message": "Question not found"
					}
				]);
			}

			let response = [
				{
					"success": true,
					"message": ""
				},
				result.rows[0]
			];

			return res.status(200).json(response);
		})
		.catch(e => {
			return res.status(400).json(e);
		});
};

exports.update_question = async function(req, res) {

	let question_id = req.params.question_id;
	let title = req.body.title;
	let category = req.body.category;
	let subcategory = req.body.subcategory;
	let difficulty = req.body.difficulty;
	let company = req.body.company;

	if(title == undefined && category == undefined && subcategory == undefined && difficulty == undefined && company == undefined) {
		return res.status(400).json([
			{
				"success": false,
				"message": "Nothing to update"
			}
		]);
	}

	let queryString = "UPDATE question SET ";
	let queryParams = [];
	let queryVals = [];
	let vals = [];
	let i = 1;

	if(title != undefined && title != "") {
		queryParams.push("title");
		queryVals.push("$" + i + "::text");
		vals.push(title);
		i += 1;
	}

	if(category != undefined && category != "") {
		queryParams.push("category");
		queryVals.push("$" + i + "::text");
		vals.push(category);
		i += 1;
	}

	if(subcategory != undefined && subcategory != "") {
		queryParams.push("subcategory");
		queryVals.push("$" + i + "::text");
		vals.push(subcategory);
		i += 1;
	}
	
	if(difficulty != undefined) {
		queryParams.push("difficulty");
		queryVals.push("$" + i + "::int");
		vals.push(difficulty);
		i += 1;
	}

	if(company != undefined && company != "") {
		queryParams.push("company");
		queryVals.push("$" + i + "::text");
		vals.push(company);
		i += 1;
	}
	
	for(let j = 0; j < queryParams.length; j++) {
		queryString += queryParams[j] + " = " + queryVals[j];

		if(j+1 != queryParams.length) {
			queryString += ", ";
		} 
	}

	vals.push(question_id);
	queryString += " WHERE question_id = $" + i + "::int RETURNING question_id;";

	await client
		.query(queryString, vals)
		.then(result => {
			let response = [
				{
					"success": true,
					"message": ""
				},
				result.rows[0]
			];
			return res.status(200).json(response);
		})
		.catch(e => {
			return res.status(400).json(e);
		});
};

exports.get_full_question = async (req, res) => {
	let secret_key = req.body.secret_key;
	let question_id = req.params.question_id;
	
	if(process.env.InterviewHighSecretKey != secret_key) {
		return res.status(400).json({
			"message": "Nothing here bro"
		});
	}

	var params = {
		TableName : "Interview_High_Questions",
		KeyConditionExpression: "pk = :pk",       
		ExpressionAttributeValues: {
			":pk": question_id
		},
	};

	dynamoDB.query(params, (err, data) =>{
		if (err) {
			return res.status(400).json(err);
		}
		try {
			let questions = data["Items"][0];
			return res.status(200).json(questions)
		} catch(err) {
			return res.status(400).json({
				"message": "Nothing here bro"
			});
		}
	});

}