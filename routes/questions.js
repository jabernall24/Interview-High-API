const express = require("express");
const app = express();
const  QuestionController  = require("../api/controllers/questions");

// Create question
app.post("/create", QuestionController.create_new_question);

app.get("/comapny/:company", QuestionController.get_questions);

app.delete("/:question_id", QuestionController.delete_question);

app.put("/:question_id", QuestionController.update_question);

app.get("/:question_id", QuestionController.get_full_question);

module.exports = app;