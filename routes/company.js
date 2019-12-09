const express = require("express");
const app = express();

const CompanyController = require("../api/controllers/company");

app.post("/create" , CompanyController.create_company);

app.get("/", CompanyController.get_all_companies);

// app.put("/:company", CompanyController.update_company);

module.exports = app;