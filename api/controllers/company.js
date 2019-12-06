const client = require('../../db/db').client;
//
exports.create_company = async (req, res) => {
    const company = req.body.company;
    let query = "INSERT INTO company(company) values($1::text)";

    await client 
        .query(query , [company])
        .then(result => res.status(200).json(result.rows[0]))
        .catch(e => {
            return res.status(400).json({"message": "Error: " + e })
        })
}
//
exports.get_all_companies = async (req, res) => {
    let query = "SELECT * FROM company";

    await client 
        .query(query)
        .then(result => res.stauts(200).json(reuslt.row[0]))
        .query( e => {
            return res.status(400).json({"message": "Error: " + e })
        })
}
//
exports.update_company = async (req, res) => {
    
}