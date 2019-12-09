const client = require("../../db/db").client;
const validator = require("email-validator");

exports.user_create = async (req, res) => {
	const email = req.body.email.toLowerCase();
	const password = req.body.password;
	const is_subscribed = req.body.is_subscribed;
	const category = req.body.category.toLowerCase();
	const subcategories = req.body.subcategories;

	if(!validator.validate(email)) {
		return res.status(400).json({"message": "Invalid Email"});
	}

	const CATEGORIES = ["computer science"];

	if (CATEGORIES.indexOf(category) <= -1) {
		return res.status(400).json({"message": "Invalid Category"});
	}

	for(let i = 0; i < subcategories.length; i++) {
		subcategories[i] = subcategories[i].toLowerCase();
	}

	await client
		.query("INSERT INTO users(email, pwd_hash, is_subscribed, category, subcategories) values($1::text, crypt($2::text, gen_salt('bf', 14)), $3::boolean, $4::text, $5::text[]) RETURNING user_id;", [email, password, is_subscribed, category, subcategories])
		.then(result => res.status(200).json(result.rows[0]))
		.catch(e => {
			if(e.code == "23505") {
				return res.status(400).json({"message": "Email already exists."});
			} else {
				return res.status(400).json({"message": "Error: " + e});
			}
		});
};

exports.user_update = async function(req, res) {
	const email = req.body.email.toLsowerCase();
	const password = req.body.password;

	let i = 1;

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
			"statusCode": 400,
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
			const response = [{ "success": true, "message": "" }];
			if(result.rows.length == 0) {
				response["success"] = false;
				response["message"] = "Invalid credentials";
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
				return res.status(200).json([{
					"success": false,
					"message": "Invalid email or password"
				}]);
			} 

			// let rows = JSON.parse(result.rows);

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


// exports.user_delete = async (req, res) => {
// 	const user_id = req.params.user_id;
// 	let query = "DROP user WHERE user_id=$1 RETURNING user_id";
	
// 	await client
// 		.query(query, [user_id])
// 		.then(result => {
// 			const response = [
// 				{
// 					"success": true,
// 					"message": "Deleted successful"
// 				}
// 			];

// 		})
// 		.catch(e => { res.status(400).json(e)});
// };