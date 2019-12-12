const express = require("express");
const app = express();
const  CategoryController  = require("../api/controllers/categories");

// Get all Categories
app.get("/", CategoryController.get_all_categories);

// Get all the subcategories with Categories
app.get("/:category", CategoryController.get_all_subcategories);

// create category 
app.post("/create", CategoryController.category_create);

//delete category
app.delete("/:category" , CategoryController.category_delete);

// update category
// app.put("category", CategoryController.category_update);

module.exports = app;