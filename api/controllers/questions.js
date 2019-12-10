const client = require("../../db/db").client;
const dynamoDB = require("../../db/db").dynamoDB;

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