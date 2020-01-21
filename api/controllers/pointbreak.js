// const client = require("../../db/db").client;
// const dynamoDB = require("../../db/db").dynamoDB;
var fs = require("fs");
// var docker = require("dockerode");
var exec = require("child_process").exec;
// var tmp = require("tmp");
// var codeMap = {
//     ".java" : "JAVA DOCKER FILE PATH",
//     ".c" : "C DOCKER FILE PATH",
//     ".cpp" : "CPP DOCKER FILE PATH",
//     ".py" : "PYTHON DOCKER FILE PATH"
// };

exports.pointbreak = async (req, res) => {
	
	let body = req.body.code;
	const user_id = req.body.user_id;
	
	body = body.join("\n");

	const data = new Uint8Array(Buffer.from(body));

	fs.writeFile("main.cpp", data, async (err) => {
		if (err) return res.status(400).json("JENR: " + err);
		
		await mikesfunction("./","main.cpp", user_id);

		fs.readFile("./out.txt", (err, data) =>{
			if(err) return res.status(400).json("MY ERROR: " + err);
			if(data.toString() === "Hello World!"){
				return res.status(200).json({"message":true});
			}
			else{
				return  res.status(200).json({"message": false});
			}
		});
	});
};

async function mikesfunction(file_path, fname, user_id) {
	const start = "docker run -it -d --name=test_" + user_id + " user:cpp";
	const f_to_c = "docker cp " + file_path + "/" + fname + " test_" + user_id + ":.";
	const compile = "docker exec test_" + user_id + " g++ " + fname;
	const execute = "docker exec test_" + user_id + " sh -c './a.out > out.txt'";
	const c_to_f = "docker cp test_" + user_id + ":/out.txt .";
	const stop = "docker stop test_" + user_id;
	const rm = "docker rm test_" + user_id;

	await run(start, false);
	await run(f_to_c, false);
	await run(compile, false);
	await run(execute, true);
	await run(c_to_f, false);
	await run(stop, false);
	await run(rm, false);

}

function run(cmd, isExecute){
	return new Promise((resolve, reject) => {
		try {
			exec(cmd, function(err, out, stderr) {
				if (err) {
					console.log(err);
					return reject(err);

				}
				console.log(out);
				console.log(stderr);
				return resolve(out);
			}); 
		} 
		catch(err){
			console.log(err);
			return reject(err);
			// throw err;
		}

		if(isExecute) {
			setTimeout(function() {reject("timeout");}, 10000);
		}
	});
}