// const client = require("../../db/db").client;
// const dynamoDB = require("../../db/db").dynamoDB;

// var fs = require("fs");
// var docker = require("dockerode");
// var codeMap = {
//     ".java" : "JAVA DOCKER FILE PATH",
//     ".c" : "C DOCKER FILE PATH",
//     ".cpp" : "CPP DOCKER FILE PATH",
//     ".py" : "PYTHON DOCKER FILE PATH"
// };

// exports.pointbreak = (req, res, next) => {
//     let user_id = req.body.user_id;
//     let question_id = req.body.questions_id;
//     let user_code = req.body.user_code;

//     var params = {
// 		TableName : "Interview_High_Questions",
// 		KeyConditionExpression: "pk = :pk",       
// 		ExpressionAttributeValues: {
//             ":pk": question_id
// 		},
//     };
//     var query_results;

//     dynamoDB.query(params, (err, data)=>{
//         if(err){
//             return res.status(400).json(err);
//         }
//         query_results= data;
//     });
//     // fs.open(user_id + question_id + req.body.ext);
//     // fs.write(req.body.code);
//     // fs.close();
//     // fs.open(question_id + "_test_cases");
//     // fs.write(query_results.test_cases);
//     // fs.close();
//     // await {
//     //     dock.build -t username:q_id
//     //     cp  file_1 username:q_id
//     //     cp file_2 username:q_id
//     //     exec build of the code via bash loop and the test test_cases
//     //     exec diff of the code vs supposed output
//     //     cp test results back here
//     //     parse results
//     // }
//     //     push results to history/dbs
//     //     results = x
//     //     res.status(200).send(x);

// };