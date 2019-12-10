const express = require("express");
const app = express();

const EmailsController = require("../api/controllers/emails");

app.put("/", EmailsController.get_emails);

app.put("/:user_id", EmailsController.get_new_question_for_user);

module.exports = app;