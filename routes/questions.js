const express = require('express');
const app = express();
const client = require('../db/db');
const  QuestionController  = require('../api/controllers/questions')

// Get all Categories
app.get('/catergories', QuestionController.questions_get_all)

module.exports = app;
