const express = require('express');
const app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const routes = require('./routes');

app.use('/user', routes.users);
app.use('/categories', routes.questions);

app.listen(process.env.PORT, "localhost", function() {
    console.log("Express server is running....");
});