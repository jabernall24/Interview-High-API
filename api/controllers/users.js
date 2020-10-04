const client = require("../../db/db").client;
const dynamoDB = require("../../db/db").dynamoDB;
const s3 = require("../../db/db").s3;
const validator = require("email-validator");

exports.user_create = async (req, res) => {
	let email = req.body.email;
	const password = req.body.password;
	let is_subscribed = req.body.is_subscribed;
	let category = req.body.category;
	let subcategories = req.body.subcategories;

	if(email == undefined || email == "") {
		return res.status(400).json({
			"message": "email not provided"
		});
	}

	email = email.toLowerCase();

	if(password == undefined || password == "") {
		return res.status(400).json({
			"message": "password not provided"
		});
	}

	if(is_subscribed == undefined || is_subscribed == "") {
		return res.status(400).json({
			"message": "is_subscribed not provided"
		});
	}
	is_subscribed = (subcategories == "true");

	if(category == undefined || category == "") {
		return res.status(400).json({
			"message": "category not provided"
		});
	}

	category = category.toLowerCase();

	if(subcategories == undefined || subcategories.length == 0) {
		return res.status(400).json({
			"message": "subcategories not provided"
		});
	}

	if(!validator.validate(email)) {
		return res.status(400).json({"message": "Invalid email"});
	}
	
	for(let i = 0; i < subcategories.length; i++) {
		if(subcategories[i] == undefined || subcategories[i] == "") {
			return res.status(400).json({
				"message": "subcategories not provided"
			});
		}
		subcategories[i] = subcategories[i].toLowerCase();
	}

	await client
		.query("INSERT INTO users(email, pwd_hash, is_subscribed, category, subcategories) " + 
				"SELECT $1::text, crypt($2::text, gen_salt('bf', 14)), $3::boolean, $4::text, $5::text[] " +  
				"WHERE EXISTS (SELECT * FROM category WHERE category = $6) " +
				"RETURNING user_id, email, is_subscribed, category, subcategories;", 
		[email, password, is_subscribed, category, subcategories, category])
		.then(result => {
			if(result.rowCount == 0) {
				return res.status(400).json({
					"message": "Invalid category"
				});
			}

			return res.status(200).json(result.rows[0]);
		})
		.catch(e => {
			if(e.code == "23505") {
				return res.status(400).json({"message": "Email already exists"});
			} else {
				return res.status(400).json({"message": "Error: " + e});
			}
		});
};

exports.user_update = async function(req, res) {
	let email = req.body.email;
	const password = req.body.password;

	let i = 1;

	if(email == undefined || password == undefined){
		return res.status(400).json({
			"success": false,
			"message": "Email or Password is not defined"
		});
	}
	email = email.toLowerCase();

	let queryString = "UPDATE users SET ";
	let queryParams = [];
	let queryVals = [];
	let vals = [];

	if(req.body.is_subscribed != undefined) {
		queryParams.push("is_subscribed");
		queryVals.push("$" + i + "::boolean");
		vals.push(req.body.is_subscribed);
		i += 1;
	}
    
	if(req.body.category != undefined ) {
		queryParams.push("category");
		queryVals.push("$" + i + "::text");
		vals.push(req.body.category.toLowerCase());
		i += 1;
	}
	if(req.body.subcategories != undefined ) {
		queryParams.push("subcategories");
		queryVals.push("$" + i + "::text[]");
		vals.push(req.body.subcategories.map(v => v.toLowerCase()));
		i += 1;
	}

	if(queryParams.length > 1){
		queryString += "(";
	} else if(queryParams.length == 0) {
		const response = {
			"success": false,
			"message": "nothing to change"
		};
		return res.status(400).json(response);
	}

	for(let j = 0; j < queryParams.length; j++) {
		if(j == 0) {
			queryString += queryParams[j];
		} else {
			queryString += ", " + queryParams[j];
		}
	}

	if(queryParams.length == 1){
		queryString += " = ";
	} else {
		queryString += ") = (";
	}

	for(let j = 0; j < queryVals.length; j++) {
		if(j == 0) {
			queryString += queryVals[j];
		} else {
			queryString += ", " + queryVals[j];
		}
	}

	if(queryParams.length > 1){
		queryString += ")";
	}

	vals.push(password);
	vals.push(email);
	queryString += " WHERE pwd_hash = crypt($" + i + "::text, pwd_hash) AND email = $" + (i+1) + "::text RETURNING user_id;";

	await client
		.query(queryString, vals)
		.then(result => {
			let response = [{ "success": true, "message": "" }];
			if(result.rows.length == 0) {
				let response = [{ "success": false, "message": "Invalid credentials" }];
				return res.status(400).json(response);
			} else {
				response.push(result.rows[0]);
			}
			return res.status(200).json(response);
		})
		.catch(e => {
			const response = {
				"success": false,
				"message": e
			};
			return res.status(400).json(response);
		});
};

exports.user_by_id = async function (req, res) {
	const userId = req.params.user_id;
	const emailComing = req.body.email;

	if(emailComing === undefined)
	{

		const response = [
			{
				"success": false,
				"message": "Email was not provided"
			}
		];
		return res.status(400).json(response);
	}

	let query1 = "SELECT * FROM users " + 
                 "WHERE user_id= $1";
    
	await client
		.query(query1, [userId])
		.then(result => {
			const response = [
				{
					"success" : true,
					"message" : ""
				},
				result.rows
			];
			return res.status(200).json(response);
		})
		.catch(e => {
			const response = [
				{
					"success" : false,
					"message" : e
				},
				userId,
				emailComing
			];
			return res.status(400).json(response);
		});
};

exports.user_login_by_email_password = async function(req, res) {
	let email = req.body.email.toLowerCase();
	const password = req.body.password;

	if(email == undefined || password == undefined) {
		return res.status(400).json([
			{
				"success": false,
				"message": "Email or password not provided"
			}
		]);
	}
	email = email.toLowerCase();
	let query  = "SELECT user_id, email, is_subscribed, category, subcategories "
				+ "FROM users WHERE email = $1::text AND pwd_hash = crypt($2::text, pwd_hash)";

	await client
		.query( query, [email, password])
		.then(result => {
			if(result.rows.length == 0) {
				return res.status(400).json([{
					"success": false,
					"message": "Invalid email or password"
				}]);
			} 
			const response = [{
				"success": true,
				"message": "Successful login"
			},
			result.rows[0]
			];
			return res.status(200).json(response);
		})
		.catch(e => res.status(400).json(e));
};

exports.user_update_password =  async function (req, res) { 
	const oldPassword = req.body.oldPassword;
	const newPassword = req.body.newPassword;
	const user_id = req.params.user_id;

	let query="UPDATE users SET pwd_hash =crypt($1::text, gen_salt('bf', 14)) "
        + "WHERE pwd_hash = crypt($2::text, pwd_hash) " 
        + "AND user_id = $3 "
        + "RETURNING user_id;";
	let vals = [newPassword, oldPassword, user_id];

	await client
		.query(query, vals)
		.then(result => {
			const response = [
				{
					"success": true,
					"message": "password was updated"
				}
			];
			if(result.rows.length == 0) {
				response[0]["success"] = false;
				response[0]["message"] = "incorrect passsword";
			} 
			else {
				response.push(result.rows);
			}
			return res.status(200).json(response);
		})
		.catch( (e) => { 
			const response = {
				"message" : "query did not work",
				"error" : e
			}; 
			return res.status(400).json(response);
		});
};

exports.user_delete = async (req, res) => {
	const user_id = req.params.user_id;
	let query = "DELETE FROM users WHERE user_id=$1 RETURNING user_id";
	
	await client
		.query(query, [user_id])
		.then(result => {
			const response = [
				{
					"success": true,
					"message": "Deleted successful"
				}
			];
			if(result.rows.length == 0){
				response[0]["success"] = false;
				response[0]["message"] = "User ID does not exit";
			}
			else {
				response.push(result.rows);
			}

			return res.status(200).json(response);
		})
		.catch(e => {
			res.status(400).json(e);
		});

};

exports.user_question_history = async (req, res) => {
	
	let user_id = parseInt(req.params.user_id);

	var params = {
		TableName: "Interview_High_User_Questions_History",
		KeyConditionExpression: "pk = :pk",
		ExpressionAttributeValues: {
			":pk": user_id 
		},
	};
	dynamoDB.query(params, async (err, data) => {
		if(err){
			return res.status(400).json(err);
		}
		try{
			let questions = data["Items"].map((name, i) => {
				return data["Items"][i]["sk"];
			});

			const placeholders = questions.map(function(name,i) { 
				return "$"+(i+1); 
			}).join(",");
	
			const queryString = "SELECT * FROM question WHERE question_id IN (" + placeholders + ");";

			await client
				.query(queryString, questions)
				.then(result => {
					return res.status(200).json(result.rows);
				})
				.catch(e => {
					return res.status(400).json(e);
				});
		}catch(err){
			return res.status(400).json({
				"message": "Nothing here bro"
			});
		}
	});
};

exports.check_user_solution = async function(req, res) {

	const startFile = req.files.starter;

	const BUCKET_NAME = "interview-high";

	const fs = require("fs");
	var content;
	fs.readFile(startFile.tempFilePath, function read(err, data) {
		if (err) {
			throw err;
		}
		content = data;

		const params = {
			Bucket: BUCKET_NAME,
			Key: "cat.cpp", // File name you want to save as in S3
			Body: content
		};
	
		s3.upload(params, function(err, data) {
			if (err) {
				return res.status(400).json(err);
			}
			return res.status(200).json(data);
		});

	});

};