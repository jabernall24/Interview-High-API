const express = require("express");
const app = express();

const UserController = require("../api/controllers/users");

// Create user
app.post("/create", UserController.user_create);

// Update user information
app.put("/:user_id", UserController.user_update);

//get user by ID
app.get("/:user_id", UserController.user_by_id);

// Get user with email and password
app.post("/login", UserController.user_login_by_email_password);

// change password and add it to data bases
app.put("/:user_id/password", UserController.user_update_password);

// delete user 
app.delete("/:user_id",UserController.user_delete);

//get users history questions
app.get("/:user_id/questions", UserController.user_question_history);

module.exports = app;