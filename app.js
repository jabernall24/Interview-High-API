const express = require('express');
const app = express();

// Connecting to db (below) ====================================================

const postgresql = require('pg');
const conString = "postgres://postgres:postgres@localhost:5432/test";

var client = new postgresql.Client(conString);
client.connect();

// Connecting to db(above) ====================================================

app.engine("html", require('ejs').renderFile);
app.use(express.static("public"));

app.get("/categories/all", function(req, res) {
    client
        .query('SELECT * FROM category WHERE cat = $1::text', ['Computer Science'])
        .then(result => res.status(200).json(result.rows))
        .catch(e => res.status(400).json(e))
        .then(() => client.end())
});

// process.env.PORT
app.listen("8080", process.env.IP, function() {
    console.log("Express server is running....");
});