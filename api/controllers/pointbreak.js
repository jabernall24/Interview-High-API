// const client = require("../../db/db");

// var express = require ('express');
// var router = express.Router();
// var fs = require('fs');
// var dock = require('NAME OF DOCKER MODULE HERE');
// var codeMap = {
//     ".java" : "JAVA DOCKER FILE PATH",
//     ".c" : "C DOCKER FILE PATH",
//     ".cpp" : "CPP DOCKER FILE PATH",
//     ".py" : "PYTHON DOCKER FILE PATH"
//     };
// router.post('/', function(req, res, next){
//     // body shape:
//     // user id : int,
//     // question id : int,
//     // user code: json
//     var con = DYNAMO_DB_CONNECTION;
//     var query_results;
//     con.connect();
//     con.query("QUERY STRING TO GET QUESTION CODE FOR TEST CASES", function (err, result){
//         if (err){
//             console.log(err);
//             throw err;
//         }
//         query_results = result;
//     });
//     fs.open(req.body.user_id + req.body.q_id + req.body.ext);
//     fs.write(req.body.code);
//     fs.close();
//     fs.open(req.body.q_id + "_test_cases");
//     fs.write(query_results.test_cases);
//     fs.close();
//    await {
//     dock.build -t username:q_id
//     cp  file_1 username:q_id
//     cp file_2 username:q_id
//     exec build of the code via bash loop and the test test_cases
//     exec diff of the code vs supposed output
//     cp test results back here
//     parse results
// }
//     push results to history/dbs
//     results = x
//     res.status(200).send(x);
// });
// module.exports = router;