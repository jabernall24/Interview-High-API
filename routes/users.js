const express = require('express');
const app = express();

const validator = require("email-validator");
const client = require('../db/db');

// Create user
app.post('/create', function(req, res) {
    console.log("K", req);
    const email = req.body.email;
    const password = req.body.password;
    const is_subscribed = req.body.is_subscribed;
    const category = req.body.category;
    const subcategories = req.body.subcategories;

    if(!validator.validate(email)) {
        return res.status(400).json({"message": "Invalid Email"});
    }

    const CATEGORIES = ['computer science'];

    if (CATEGORIES.indexOf(category) <= -1) {
        return res.status(400).json({"message": "Invalid Category"});
    }

    for(let i = 0; i < subcategories.length; i++) {
        subcategories[i] = subcategories[i].toLowerCase();
    }

    client
        .query("INSERT INTO users(email, pwd_hash, is_subscribed, category, subcategories) values(lower($1::text), crypt($2::text, gen_salt('bf', 14)), $3::boolean, $4::text, $5::text[]) RETURNING user_id;", [email, password, is_subscribed, category, subcategories])
        .then(result => res.status(200).json(result.rows[0]))
        .catch(e => {
            if(e.code == "23505") {
                return res.status(400).json({"message": "Email already exists."});
            } else {
                return res.status(400).json({"message": "Error: " + e});
            }
        })
});

// Update user information
app.put('/:user_id', async function(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    let i = 1;

    let queryString = "UPDATE users SET ";
    let queryString = [];
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
        queryString += "("
    } else if(queryParams.length == 0) {
        response = {
            "statusCode": 400,
            "message": "nothing to change"
        }
        return res.status(400).json(response);
    }

    for(var j = 0; j < queryParams.length; j++) {
        if(j == 0) {
            queryString += queryParams[j];
        } else {
            queryString += ", " + queryParams[j];
        }
    }

    if(queryParams.length == 1){
        queryString += " = "
    } else {
        queryString += ") = ("
    }

    for(var j = 0; j < queryVals.length; j++) {
        if(j == 0) {
            queryString += queryVals[j];
        } else {
            queryString += ", " + queryVals[j];
        }
    }

    if(queryParams.length > 1){
        queryString += ")"
    }

    vals.push(password);
    vals.push(email);
    queryString += " WHERE pwd_hash = crypt($" + i + "::text, pwd_hash) AND email = $" + (i+1) + "::text RETURNING user_id;";

    await client
        .query(queryString, vals)
        .then(result => {
            response = [{ "success": true, "message": "" }]
            if(result.rows.length == 0) {
                response["success"] = false;
                response["message"] = "Invalid credentials";
            } else {
                response.push(result.rows[0]);
            }
            res.status(200).json(response)
        })
        .catch(e => {
            response = {
                "success": false,
                "message": e
            }
            res.status(400).json(e);
        })
})

//get user by ID
app.get('/user/:user_id', function (req, res) {
    const userId = req.params.user_id;
    const emailComing = req.body.email;

    let query1 = 'SELECT * FROM users ' + 
                 'WHERE user_id= $1';
    
    client
    .query(query1, [userId])
    .then(result => {
        response = [
            {
                "success" : true,
                "message" : ""
            },
            result.rows
        ]
        res.status(200).json(response);
    })
    .catch(e => {
       response = [
            {
                "success" : false,
                "message" : e
            },
            userId,
            emailComing
        ]
        return res.status(400).json(response)
    });
});

// Get user with email and password
app.post('/login', async function(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    console.log(email);
    console.log(password);

    await client
        .query("SELECT user_id, email, is_subscribed, category, subcategories FROM users WHERE email = lower($1::text) AND pwd_hash = crypt($2::text, pwd_hash)", [email, password])
        .then(result => {
            response = [{
                "success": true,
                "message": ""
            },
                result.rows[1]
            ];
            res.status(200).json(response);
        })
        .catch(e => res.status(400).json(e))
});

// Endpoint used to test I did not break anything on other files
app.get('/', async function(req, res) {
    await client
        .query("SELECT * FROM users;")
        .then(result => {
            return res.status(200).json(result.rows)
        })
        .catch(e => res.status(400).json(e))
})
// change password and add it to data bases
app.put('/:user_id/password', async function (req, res) {

    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const user_id = req.params.user_id;


   let query="UPDATE users SET pwd_hash =crypt($1::text, gen_salt('bf', 14)) "
        + "WHERE pwd_hash = crypt($2::text, gen_salt('bf', 14)) " 
        + "AND user_id = $3 "
        + "RETURNING user_id;"
    let vals = [newPassword, oldPassword, user_id]

    await client
        .query(query, vals)
        .then(result => {
            response = [{
                "success": true,
                "message": "password was updated"
                },
                result['user_id']
            ];
            return res.status(200).json(response);
        })
        .catch( (e) => { 
            response = {
                "message" : "query did not work",
                "error" : e
            }; 
            res.status(400).json(response)
        })
})




module.exports = app;
