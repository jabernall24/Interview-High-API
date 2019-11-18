const client = require('../../db/db');

exports.questions_get_all = async function (req, res) {
    let query = "SELECT * FROM category;"
    client
    .query(query)
    .then(result => {
        response = [
            {
                "success" : true,
                "message" : "It was a success"
            },
            result.rows
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

exports.questions_get_subcategories = async function (req, res){
    
    query = "SELECT "

    client
    .query(query)
    .then(result => {
        response = [
            {
                "success" : true,
                "message" : "get subcategories worked"
            },
            result.rows
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