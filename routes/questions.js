const express = require('express');
const app = express();
const  QuestionController  = require('../api/controllers/questions');

// Create question
app.post('/create', QuestionController.create_new_question);


module.exports = app;