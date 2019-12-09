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
					"message": "Succefully grabed"
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

// exports.update_company = async (req, res) => {
	
// };
