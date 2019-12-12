const express = require("express");
const app = express();
const PointbreakController = require("../api/controllers/pointbreak");

app.get("/pointbreak" , PointbreakController.pointbreak);

module.exports = app;