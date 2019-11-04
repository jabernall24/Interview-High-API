const express = require('express');
const app = express();

const dotenv = require('./config')

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const routes = require('./routes')

app.use('/users', routes.users)

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Express server is running....");
});