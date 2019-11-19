const express = require('express');
const app = express();
const  QuestionController  = require('../api/controllers/questions')

// Get all Categories
app.get('/', QuestionController.questions_get_all);

// Get all the subcategories with Categories
app.get('/:category', QuestionController.questions_get_subcategories);


module.exports = app;