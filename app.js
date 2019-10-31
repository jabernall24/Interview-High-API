const express = require('express');
const app = express();
const kk = require("knock-knock-jokes");

app.engine("html", require('ejs').renderFile);
app.use(express.static("public"));

//routes - Project/Homework 4

app.get("/", function(req, res) {
    res.render("index.html");
});

app.get("/fs", function(req, res) {
    res.render("fs.html");
});

app.get("/mem", function(req, res) {
    res.render("mem.html");
});

app.get("/proc", function(req, res) {
    res.render("proc.html");
});

app.get("/index", function(req, res) {
    res.render("index.html");
});

app.get('*:x', function(req, res) {
    res.send("ERROR 404: The url \"" + req.url.substr(1) + "\" was invalid.....here's a joke:\n" + kk());
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Express server is running....");
});