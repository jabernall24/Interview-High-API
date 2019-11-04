const express = require('express');
const app = express();

const validator = require("email-validator");

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connecting to db (below) ====================================================

const postgresql = require('pg');
const conString = "postgres://postgres:postgres@localhost:5432/test";

var client = new postgresql.Client(conString);
client.connect();

// Connecting to db(above) ====================================================

// USER
// ========================================================================================================
// Create user
app.post('/users/add', function(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const category = req.body.category;

    if(!validator.validate(email)) {
        return res.status(400).json({"message": "Invalid Email"});
    }

    const CATEGORIES = ['Computer Science']

    if (CATEGORIES.indexOf(category) <= -1) {
        return res.status(400).json({"message": "Invalid Category"});
    } 

    client
        .query('INSERT INTO users(email, pass, q_cat) values($1::text, $2::text, $3::text);', [email, password, category])
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
app.post('/users/login', async function(req, res) {
    console.log(req.body);
    const email = req.body.email;
    const password = req.body.password;

    await client
        .query("SELECT * FROM users WHERE email = $1::text AND pass = $2::text", [email, password])
        .then(result => res.status(200).json(result.rows))
        .catch(e => res.status(400).json(e))
});

// process.env.PORT
app.listen("8080", process.env.IP, function() {
    console.log("Express server is running....");
});