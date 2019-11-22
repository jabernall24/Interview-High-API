const client = require('../../db/db').client;

exports.get_all_categories = async function (req, res) {
    let query = "SELECT DISTINCT category FROM category;"
    client
    .query(query)
    .then(result => {
        
        let dArray = result.rows;

        let categories = []
        for(item in dArray) {
            Object.keys(dArray[item]).forEach(function(key) {
                let val = dArray[item][key];
                categories.push(val);
            });
        }

        response = [
            {
                "success" : true,
                "message" : "It was a success"
            },
            {
                "categories": categories
            }
        ]
        res.status(200).json(response)
    })
    .catch(e => {
        response = [
            {
                "success": false,
                "message": e
            }
        ];
        res.status(400).json(response);

    })
};

exports.get_all_subcategories = async function (req, res){
    
    let query = "SELECT subcategory FROM category WHERE category = $1::text;"
    let params = [req.params.category]

    client
        .query(query, params)
        .then(result => {

            let dArray = result.rows;

            let subcats = []
            for(item in dArray) {
                Object.keys(dArray[item]).forEach(function(key) {
                    let val = dArray[item][key];
                    subcats.push(val);
                });
            }

            response = [
                {
                    "success" : true,
                    "message" : "get subcategories worked"
                },
                {
                    "subcategories": subcats
                }
            ]
            res.status(200).json(response)
        })
        .catch(e => {
            response = [
                {
                    "success": false,
                    "message": e
                }
            ];
            res.status(400).json(response);

        })

};