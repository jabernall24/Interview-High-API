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
				res.status(400).json([
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
			res.status(200).json(response);
		})
		.catch(e => {
			const response = [
				{
					"success": false,
					"message": e
				}
			];
			res.status(400).json(response);

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
				res.status(400).json([
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
			res.status(200).json(response);
		})
		.catch(e => {
			const response = [
				{
					"success": false,
					"message": e
				}
			];
			res.status(400).json(response);

		});

};