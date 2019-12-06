const express = require('express');
const app = express();
const CompanyController = require('../api/controllers/company');


// endpoint to create compnay 
app.post('/create', CompanyController.create_company);  

//endpoint to grab all companies 
app.get('/', CompanyController.get_all_companies);

//updating companies information
app.put('/:company', CompanyController.update_company);

