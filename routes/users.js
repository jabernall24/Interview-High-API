const express = require('express');
const app = express();

const validator = require("email-validator");

const client = require('../db');

// Create user
app.post('/add', function(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const is_subscribed = req.body.is_subscribed;
    const category = req.body.category.toLowerCase();
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
        .query("INSERT INTO users(email, pwd_hash, is_subscribed, category, subcategories) values(lower($1::text), crypt($2::text, gen_salt('bf', 14)), $3::boolean, lower($4::text), $5::text[]) RETURNING user_id;", [email, password, is_subscribed, category, subcategories])
        .then(result => res.status(200).json(result.rows[0]))
        .catch(e => {
            if(e.code == "23505") {
                return res.status(400).json({"message": "Email already exists."});
            } else {
                return res.status(400).json({"message": "Error: " + e});
            }
        })
});

// Get user with email and password
app.post('/login', async function(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    await client
        .query("SELECT user_id, email, is_subscribed, category, subcategories FROM users WHERE email = lower($1::text) AND pwd_hash = crypt($2::text, pwd_hash)", [email, password])
        .then(result => res.status(200).json(result.rows[0]))
        .catch(e => res.status(400).json(e))
});

// Endpoint used to test I did not break anything on other files
app.get('/', async function(req, res) {
    await client
        .query("SELECT * FROM users;")
        .then(result => res.status(200).json(result.rows))
        .catch(e => res.status(400).json(e))
})

module.exports = app;