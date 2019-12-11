const client = require("../../db/db").client;
const dynamoDB = require("../../db/db").dynamoDB;

exports.get_emails = async function(req, res) {

	let secret_key = req.body.secret_key;

	if(process.env.InterviewHighSecretKey != secret_key) {
		return res.status(400).json({
			"message": "Nothing here bro"
		});
	}

	await client
		.query("SELECT email, user_id FROM users WHERE is_subscribed = true")
		.then(result => {
			let emails = [];
			for(let row in result.rows) {
				emails.push({
					"user_id": result.rows[row]["user_id"],
					"email": result.rows[row]["email"]
				});
			}
			return res.status(200).json(emails);
		})
		.catch(e => {   
			return res.status(400).json(e);
		});
};

exports.get_new_question_for_user = function(req, res) {
	let secret_key = req.body.secret_key;

	if(process.env.InterviewHighSecretKey != secret_key) {
		return res.status(400).json({
			"message": "Nothing here bro"
		});
	}

	let user_id = parseInt(req.params.user_id);
	
	// Interview_High_User_Questions_History
	var params = {
		TableName : "Interview_High_User_Questions_History",
		KeyConditionExpression: "pk = :pk",       
		ExpressionAttributeValues: {
			":pk": user_id
		},
	};

	dynamoDB.query(params, function(err, data) {
		if (err) {
			return res.status(400).json(err);
		}

		let questions = [];
		try {
			questions = data["Items"].map((name, i) => {
				return data["Items"][i]["sk"];
			});
		} catch(err) {
			return res.status(400).json({
				"message": "Nothing here bro"
			});
		}

		const placeholders = questions.map(function(name,i) { 
			return "$"+(i+1); 
		}).join(",");

		let queryString = "";
		if(questions.length != 0) {
			queryString = "SELECT question_id FROM question WHERE question_id NOT IN (" + placeholders + ") ORDER BY random() LIMIT 1;";
		} else {
			queryString = "SELECT question_id FROM question ORDER BY random() LIMIT 1;";
		}

		client
			.query(queryString, questions)
			.then(result => {
				return res.status(200).json(result.rows);
			})
			.catch(e => {
				return res.status(400).json(e);
			});

	});
};