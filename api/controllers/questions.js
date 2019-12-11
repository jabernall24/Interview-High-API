const client = require("../../db/db").client;
const dynamoDB = require("../../db/db").dynamoDB;
const s3 = require("../../db/db").s3;
const fs = require('fs');
exports.create_new_question = async function(req, res) {

	let title = req.body.title;
	let category = req.body.category;
	let subcategory = req.body.subcategory;
	let difficulty = req.body.difficulty;
	let company = req.body.company;
	let rating = 0;
	let rating_counter = 0;
	let question = req.body.question;
	let answer = req.body.answer;

	if(title == undefined || title == ""
	|| category == undefined || category == ""
	|| subcategory == undefined || subcategory == ""
	|| difficulty == undefined || difficulty == ""
	|| company == undefined || company == "" 
	|| question== undefined || question== ""
	|| answer == undefined || answer == ""){
		return res.status(400).json({"success": false, "message": "Information missing need all"});
	}

	let queryString = "INSERT INTO question(title, category, subcategory, difficulty, company, rating, rating_counter) values($1::text, $2::text, $3::text, $4::int, $5::text, $6::int, $7::int) RETURNING *;";
	let queryValues = [title, category, subcategory, difficulty, company, rating, rating_counter];

	client
		.query(queryString, queryValues)
		.then(result => {
			let field = result.rows[0];
			console.log(field.question_id);

			var params = {
				RequestItems: {
					"Interview-High-Questions": [
						{
							PutRequest: {
								Item: {
									"pk": { "N": field.question_id.toString() },
									"sk": { "S": "Q" },
									"Question": { "L": question.map(x => { return { "S": x.toString() };}) }
								}
							}
						},
						{
							PutRequest: {
								Item: {
									"pk": { "N": field.question_id.toString() },
									"sk": { "S": "A" },
									"Answer": { "L": answer.map(x => { return { "S": x.toString() };}) }
								}
							}
						}
					]
				}
			};

			dynamoDB.batchWriteItem(params, function(err, data) {
				console.log(data);
				if (err) {
					const response = [
						{
							"success": false,
							"message": err
						},
						{
							"question_id": null
						}
					];

					return res.status(400).json(response);
				} else {

					const response = [
						{
							"success": true,
							"message": ""
						},
						{
							"question_id": field.question_id
						}
					];

					return res.status(200).json(response);
				}
			});
		})
		.catch(e => {
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
	let question_id = req.params.question_id;
	// var stringFiles = [];
	let header = {"success": false}
	let body = [] 

	let answer = "Questions/" + question_id + "/answer.cpp"; 
	let starter = "Questions/" + question_id + "/starter.cpp";
	let question = "Questions/" + question_id + "/question.txt";

	let paramAnswer = {
		Bucket: 'interview-high',
		Key: starter
	};

	let paramStarter = {
		Bucket: 'interview-high',
		Key: answer
	};
	let paramQuestions = {
		Bucket: 'interview-high',
		Key: question
	};

	await s3.getObject(paramAnswer).promise()
		.then((resp)=>{
			header["success"] = true;
	 		body.push(resp.Body.toString());
		})
		.catch((error)=>{
			return res.status(400).json(err);
		})

	await s3.getObject(paramQuestions).promise()
		.then((resp)=>{
			header["success"] = true;
	 		body.push(resp.Body.toString());
		})
		.catch((error)=>{
			return res.status(400).json(err);
		})

	await s3.getObject(paramStarter).promise()
		.then((resp)=>{
			header["success"] = true;
	 		body.push(resp.Body.toString());
		})
		.catch((error)=>{
			return res.status(400).json(err);
		})



	// await s3.getObject(paramAnswer, (err, data) =>{
	// 	if (err) {
	// 		return res.status(400).json(err);
	// 	}
	// 	try {
	// 		// fs.writeFileSync(filepath, data.Body.toString())
	// 		// let response = [
	// 		// 	{
	// 		// 		"success": true,
	// 		// 		"message": "Answer"
	// 		// 	},
	// 		// 	data.Body.toString()
	// 		// ];
	// 		console.log(data.Body.toString())
	// 		header["success"] = true;
	// 		body.push(data.Body.toString());
	// 		// return res.status(200).json(response);
	// 	} catch(err) {
	// 		return res.status(400).json({
	// 			"message": "Nothing here bro 12345"
	// 		});

	return res.status(200).json([header, body]);

};

// [
//     {
//         "Key": "/questions/19/starter.cpp",
//         "LastModified": "2019-12-10T10:24:56.000Z",
//         "ETag": "\"db698e6202a428f255d49fb146371805\"",
//         "Size": 137,
//         "StorageClass": "STANDARD",
//         "Owner": {
//             "DisplayName": "jabernall",
//             "ID": "d5f07dc6452bfa6c71f36a8a78bcb00639365ef259cdb927e7e0feb3a6eaff48"
//         }
//     },
//     {
//         "Key": "Questions/8/answer.cpp",
//         "LastModified": "2019-12-10T22:02:23.000Z",
//         "ETag": "\"13340b37c5fcff07b4405b8731f3bf62\"",
//         "Size": 164,
//         "StorageClass": "STANDARD",
//         "Owner": {
//             "DisplayName": "jabernall",
//             "ID": "d5f07dc6452bfa6c71f36a8a78bcb00639365ef259cdb927e7e0feb3a6eaff48"
//         }
//     },
//     {
//         "Key": "Questions/8/question.txt",
//         "LastModified": "2019-12-10T22:02:23.000Z",
//         "ETag": "\"bf5bf25bbf2ccd57d428c126e1eecfba\"",
//         "Size": 22,
//         "StorageClass": "STANDARD",
//         "Owner": {
//             "DisplayName": "jabernall",
//             "ID": "d5f07dc6452bfa6c71f36a8a78bcb00639365ef259cdb927e7e0feb3a6eaff48"
//         }
//     },
//     {
//         "Key": "Questions/8/starter.cpp",
//         "LastModified": "2019-12-10T22:02:23.000Z",
//         "ETag": "\"db698e6202a428f255d49fb146371805\"",
//         "Size": 137,
//         "StorageClass": "STANDARD",
//         "Owner": {
//             "DisplayName": "jabernall",
//             "ID": "d5f07dc6452bfa6c71f36a8a78bcb00639365ef259cdb927e7e0feb3a6eaff48"
//         }
//     },
//     {
//         "Key": "Questions/8/tests.cpp",
//         "LastModified": "2019-12-10T22:02:23.000Z",
//         "ETag": "\"f4cc0b0ec032947b4edb4ff952b59c1c\"",
//         "Size": 15,
//         "StorageClass": "STANDARD",
//         "Owner": {
//             "DisplayName": "jabernall",
//             "ID": "d5f07dc6452bfa6c71f36a8a78bcb00639365ef259cdb927e7e0feb3a6eaff48"
//         }
//     }
// ]