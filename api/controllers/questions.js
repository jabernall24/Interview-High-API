const client = require('../../db/db');
const validator = require("email-validator");


exports.questions_get_all = function (req, res) {
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