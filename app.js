// Dependencies
const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');

const app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const routes = require("./routes");

app.use("/user", routes.users);
app.use("/categories", routes.categories);
app.use("/questions", routes.questions);
app.use("/pointbreak", routes.pointbreak);

if(process.env.HOST != "localhost") {
	// Certificate
	const privateKey = fs.readFileSync('/etc/letsencrypt/live/api.interviewhigh.com/privkey.pem', 'utf8');
	const certificate = fs.readFileSync('/etc/letsencrypt/live/api.interviewhigh.com/fullchain.pem', 'utf8');
	// const ca = fs.readFileSync('/etc/letsencrypt/live/api.interviewhigh.com/chain.pem', 'utf8');

	const credentials = {
		key: privateKey,
		cert: certificate,
		ca: ca
	};

	const httpsServer = https.createServer(credentials, app);

	httpsServer.listen(443, () => {
		console.log('HTTPS Server running on port 443');
	});

	module.exports = httpsServer;
}


// Starting both http & https servers
const httpServer = http.createServer(app);


httpServer.listen(process.env.PORT, () => {
	console.log('HTTP Server running on port ' + process.env.PORT);
});

module.exports = {
	app,
	https
}

// const express = require("express");
// const app = express();

// var bodyParser = require("body-parser");
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// const routes = require("./routes");

// app.use("/user", routes.users);
// app.use("/categories", routes.categories);
// app.use("/questions", routes.questions);
// app.use("/pointbreak", routes.pointbreak);

// app.listen(process.env.PORT, process.env.HOST, function() {
// 	console.log("Express server is running.... " + process.env.PORT);
// });

// module.exports = app;