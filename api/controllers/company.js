const client  = require("../../db/db").client;

let getlistCompanies =  (listObj)  => {
	var listOfCompanies = [];
	listObj.forEach( (item, index) => {
		listOfCompanies.push(listObj[index]["company"]);
	}); 
	return listOfCompanies;
};

exports.create_company = async (req ,res) => {
	const company = req.body.company;
	let query  = "INSERT INTO company(company) values($1::text) "
				+"RETURNING company";
				
	if(company == undefined || company == "")
	{
		return res.status(400).json({"success": false, "message": "Company not provided"})
	}

	await client 
		.query(query , [company])
		.then(result => {
			const response  = [
				{
					"success": true,
					"message": "Create company successful"
				},
			];
			if(!response.rows){
				response.push(result.rows);                
			}
			return res.status(200).json(response); 
		})
		.catch(e => {
			return res.status(400).json({"message": e});
		});
};

exports.get_all_companies = async (req ,res) => {
	let query = "SELECT * FROM company";

	await client
		.query(query)
		.then(result => {
			const response = [
				{
					"success": true,
					"message": "Successfully grabed"
				},
			];
			const comList = getlistCompanies(result.rows);
			response.push(comList);
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

exports.company_delete = async (req, res) => {
	const company = req.params.company;
	const query = "DELETE FROM company WHERE company=$1 RETURNING company";

	await client
		.query(query, [company])
		.then(results =>{
			let response = [
				{
					"success": true,
					"message": "Successfully deleted"
				}
			];
			console.log(results.rows.length);
			if(results.rows.length == 0){
				response[0]["success"] = false;
				response[0]["message"] = "No existing company";
				return res.status(400).json(response);
			}
			else{
				response.push(results.rows);
				return res.status(200).json(response);
			}
			
		})
		.catch(e => res.status(400).json(e));
};

exports.update_company = async (req, res) => {
	let company = req.params.company;
	let newName = req.body.company;
	const query = "UPDATE company SET company=$1::text "
				+ "WHERE company=$2 RETURNING company";

	if(newName == undefined || newName == "")
	{
		return res.status(400).json({"success":false ,"message": "No new name provided"});
	}

	await client
		.query(query, [newName, company])
		.then(result => {
			const response = [
				{
					"success": true,
					"message": "Successfully Update Company"
				},
				result.rows
			];
			return res.status(200).json(response);
		})
		.catch(e => 
			{
				let response = [
					{
						"success": false, 
						"message" : e
					}
				];
				if(e['code'] == 23505){
					response[0]["message"] = "Name already exist try different"
					response[0]["error"] = e;
				}

				return res.status(400).json(response);
			});

};

