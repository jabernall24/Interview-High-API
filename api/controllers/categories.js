const client = require("../../db/db").client;

function getArrayFromArrayOfDictionaries(arr) {
	let result = [];

	for(let item in arr) {
		Object.keys(arr[item]).forEach(function(key) {
			let val = arr[item][key];
			result.push(val);
		});
	}

	return result;
}

exports.get_all_categories =  async function (req, res) {
	let query = "SELECT DISTINCT category FROM category;";
	await client
		.query(query)
		.then(result => {
            
			let categories = getArrayFromArrayOfDictionaries(result.rows);

			if(categories.length == 0) {
				return res.status(400).json([
					{
						"success" : false,
						"message" : "Invalid category"
					},
					{
						"categories": null
					}
				]);
			}

			const response = [
				{
					"success" : true,
					"message" : ""
				},
				{
					"categories": categories
				}
			];
			return res.status(200).json(response);
		})
		.catch(e => {
			const response = [
				{
					"success": false,
					"message": e
				}
			];
			return res.status(400).json(response);

		});
};

exports.get_all_subcategories = async function (req, res){
    
	let query = "SELECT subcategory FROM category WHERE category = $1::text;";
	let params = [req.params.category];

	await client
		.query(query, params)
		.then(result => {

			let subcats = getArrayFromArrayOfDictionaries(result.rows);

			if(subcats.length == 0) {
				return res.status(400).json([
					{
						"success" : false,
						"message" : "Invalid category"
					},
					{
						"categories": null
					}
				]);
			}

			const response = [
				{
					"success" : true,
					"message" : "get subcategories worked"
				},
				{
					"subcategories": subcats
				}
			];
			return res.status(200).json(response);
		})
		.catch(e => {
			const response = [
				{
					"success": false,
					"message": e
				}
			];
			return res.status(400).json(response);

		});

};

exports.category_create = async (req , res) => {
	const category = req.body.category;
	const subcategory = req.body.subcategory;

	if(category == undefined || category == "" || subcategory == undefined || subcategory == ""){
		return res.status(400).json({"success": false, "message": "No category or subcategory defined"});
	}
	const query = "INSERT INTO category(category, subcategory) values($1::text, $2::text) RETURNING category , subcategory" ;

	await client 
		.query(query, [category,subcategory])
		.then( (result) => {

			const response = [
				{
					"success": true, 
					"message": "Category Information successfully added"
				},
				result.rows
			];
			return res.status(200).json(response);
		})
		.catch(e => res.status(400).json(e));

};

exports.category_delete = async (req , res) => {
	const category = req.params.category;
	const subcategory = req.body.subcategory;

	if(category == undefined || category == "" || subcategory == undefined || subcategory == ""){
		return res.status(400).json({"success": false, "message": "No category or subcategory defined"});
	}

	const query = "DELETE FROM category WHERE category = $1::text "
				+"AND subcategory = $2::text "
				+"RETURNING category, subcategory";

	await client 
		.query(query,[category, subcategory])
		.then(result => {
			const response = [
				{
					"success": true,
					"massage": "Successfully deleted"
				}
			];
			if(result.rows.length == 0)
			{
				response[0]["success"] = false;
				response[0]["massage"] = "Unsuccessfully deleted No subcategory";
				return res.status(400).json(response);
			}
			else {
				response.push(result.rows);
				return res.status(200).json(response);
			}
		})
		.catch(e => res.status(400).json(e));

};


// exports.category_update = async (req ,res) => {
// 	const category = req.body.category;
// 	const subcategory = req.body.subcategory;

// 	if(category == undefined || category == "" || subcategory == undefined || subcategory == ""){
// 		return res.status(400).json({"success": false, "message": "No category or subcategory defined"})
// 	}
// 	const query = "UPDATE category set"
// 	await client
// 		.query()
// 		.then()
// 		.catch();

// };