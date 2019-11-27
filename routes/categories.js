const express = require("express");
const app = express();
const  CategoryController  = require("../api/controllers/categories");

// Get all Categories
app.get("/", CategoryController.get_all_categories);

// Get all the subcategories with Categories
app.get("/:category", CategoryController.get_all_subcategories);

module.exports = app;