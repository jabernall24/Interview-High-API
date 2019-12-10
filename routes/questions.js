const express = require("express");
const app = express();
const  QuestionController  = require("../api/controllers/questions");

// Create question
app.post("/create", QuestionController.create_new_question);

app.get("/:company", QuestionController.get_questions);

app.delete("/:question_id", QuestionController.delete_question);

module.exports = app;