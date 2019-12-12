// const client = require("../../db/db").client;
// const dynamoDB = require("../../db/db").dynamoDB;
var fs = require("fs");
// var docker = require("dockerode");
// var exec = require("child_process").exec;
// var codeMap = {
//     ".java" : "JAVA DOCKER FILE PATH",
//     ".c" : "C DOCKER FILE PATH",
//     ".cpp" : "CPP DOCKER FILE PATH",
//     ".py" : "PYTHON DOCKER FILE PATH"
// };

exports.pointbreak = async (req, res) => {
	// console.log("HERE");
	
	let body = req.body.code;
	
	body = body.join("\n");

	// const fs = require("fs");

	let file_path = "/tmp/test";

	fs.writeFile(file_path, body, async function(err) {

		if(err) {
			return res.status(400).json(err);
		}

		return res.status(200).json("sdaf");

		// await mikesfunction(file_path,"main.cpp");

		// fs.readFile("./out.txt", (err, data) =>{
		// 	if(err) return res.status(400).json(err);
		// 	if(data.toString() === "Hello World!\n"){
		// 		return res.status(200).json({"message":true});
		// 	}
		// 	else{
		// 		return  res.status(400).json({"message": false});
		// 	}
		// });
	}); 
	// let file_path =  req.files.main.tempFilePath;
	// console.log(file_path);
	// let fname = req.files.main.name;
	// let str;
	// await mikesfunction(file_path,"main.cpp");

	// fs.readFile("./out.txt", (err, data) =>{
	// 	if(err) return res.status(400).json(err);

	// 	str = data.toString();
	// 	if(str === "Hello World!\n"){
	// 		return res.status(200).json({"message":true});
	// 	}
	// 	else{
	// 		return  res.status(400).json({"message": false});
	// 	}
	// });
    
};

// async function mikesfunction(file_path, fname) {
// 	var start = "docker run -it -d --name=test user:cpp";
// 	var f_to_c = "docker cp " + file_path + "/" + fname + " test:.";
// 	var compile = "docker exec test g++ " + fname;
// 	var execute = "docker exec test sh -c './a.out > out.txt'";
// 	var c_to_f = "docker cp test:/out.txt .";
// 	var stop = "docker stop test";
// 	var rm = "docker rm test";

// 	await run(start);
// 	await run(f_to_c);
// 	await run(compile);
// 	await run(execute);
// 	await run(c_to_f);
// 	await run(stop);
// 	await run(rm);

// }

// function run(cmd){
// 	return new Promise((resolve, reject) => {
// 		try{
// 			exec(cmd, function(err, out, stderr) {
// 				if (err) {
// 					console.log(err);
// 					return reject(err);

// 				}
// 				console.log(out);
// 				console.log(stderr);
// 				return resolve(out);
// 			}); 
// 		}  
// 		catch(err){
// 			console.log(err);
// 			throw err;
// 		}
// 	});
// }