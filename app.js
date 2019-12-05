const express = require("express");
const app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const routes = require("./routes");

app.use("/user", routes.users);
app.use("/categories", routes.categories);
app.use("/questions", routes.questions);
app.use("/pointbreak", routes.pointbreak);

app.listen(process.env.PORT, process.env.HOST, function() {
	console.log("Express server is running.... " + process.env.PORT);
});

module.exports = app;
