const express = require('express');
const app = express();

const validator = require("email-validator");

const client = require('../db');

// Create user
app.post('/add', function(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const is_subscribed = req.body.is_subscribed;
    const category = req.body.category;
    const sub_cat = req.body.sub_cat;

    if(!validator.validate(email)) {
        return res.status(400).json({"message": "Invalid Email"});
    }

    const CATEGORIES = ['Computer Science']

    if (CATEGORIES.indexOf(category) <= -1) {
        return res.status(400).json({"message": "Invalid Category"});
    }

    client
        .query('INSERT INTO users(email, pwd_hash, is_subscribed, category, subcategories) values($1::text, $2::text, $3::boolean, $4::text, $5::text[]);', [email, password, is_subscribed, category, sub_cat])
        .then(result => res.status(200).json(result.rows))
        .catch(e => {
            if(e.code == "23505") {
                return res.status(400).json({"message": "Email already exists."});
            } else {
                return res.status(400).json({"message": e});
            }
        })
});

// Get user with email and password
app.post('/login', async function(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    await client
        .query("SELECT * FROM users WHERE email = $1::text AND pwd_hash = $2::text", [email, password])
        .then(result => res.status(200).json(result.rows))
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