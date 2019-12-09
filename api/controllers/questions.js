const client = require("../../db/db").client;
const dynamoDB = require("../../db/db").dynamoDB;

exports.create_new_question = async function(req, res) {

	let title = req.body.title;
	let category = req.body.category;//
	let subcategory = req.body.subcategory;//
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
		return res.status(400).json({"success": false, "message": "Information missing need all"})
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
					console.log("Entered")
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