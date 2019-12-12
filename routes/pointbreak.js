const express = require("express");
const app = express();
const PointbreakController = require("../api/controllers/pointbreak");

app.post("/" , PointbreakController.pointbreak);

module.exports = app;