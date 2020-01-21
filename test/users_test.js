// const chai = require("chai");
// const expect = chai.expect;
// const chaiHttp = require("chai-http");
// const client = require("../db/db").client;
// chai.use(chaiHttp);

// const app = require("../app").app;

// describe("/user/create", () => {

// 	const path = "/user/create";
// 	let user = {
// 		email: "jabernall24@gmail.com",
// 		password: "klasjdnfj@$3rint9",
// 		is_subscribed: false,
// 		category: "computer science",
// 		subcategories: ["arrays", "hash map"]
// 	};

// 	afterEach(done => {
// 		user = {
// 			email: "jabernall24@gmail.com",
// 			password: "klasjdnfj@$3rint9",
// 			is_subscribed: false,
// 			category: "computer science",
// 			subcategories: ["arrays", "hash map"]
// 		};

// 		client
// 			.query("DELETE FROM users WHERE email = $1;", [user.email])
// 			.then(done())
// 			.catch(error => {
// 				done(error);
// 			});
// 	});

// 	it("Returns 200 status", done => {
// 		chai.request(app)
// 			.post(path)
// 			.set("content-type", "application/x-www-form-urlencoded")
// 			.send(user)
// 			.then(response => {
// 				expect(response).to.have.status(200);
// 				done();
// 			})
// 			.catch(error => {
// 				done(error);
// 			});
// 	});
    
// 	it("Returns a new user object", (done) => {
// 		chai.request(app)
// 			.post(path)
// 			.set("content-type", "application/x-www-form-urlencoded")
// 			.send(user)
// 			.then(response => {
// 				expect(response.body).to.have.property("user_id");
// 				expect(response.body.user_id).not.equal(null);
// 				expect(response.body).to.have.property("email");
// 				expect(response.body.email).to.equal(user.email);
// 				expect(response.body).to.have.property("is_subscribed");
// 				expect(response.body.is_subscribed).to.equal(user.is_subscribed);
// 				expect(response.body).to.have.property("category");
// 				expect(response.body.category).to.equal(user.category);
// 				expect(response.body).to.have.property("subcategories");
// 				expect(response.body.subcategories).to.eql(user.subcategories);
// 				done();
// 			})
// 			.catch(error => {
// 				done(error);
// 			});
// 	});

// 	it("Returns 400 status and 'email not provided' error message", (done) => {
// 		delete user.email;

// 		chai.request(app)
// 			.post(path)
// 			.set("content-type", "application/x-www-form-urlencoded")
// 			.send(user)
// 			.then(response => {
// 				expect(response).to.have.status(400);
// 				expect(response.body).to.have.property("message");
// 				expect(response.body.message).to.equal("email not provided");
// 				done();
// 			})
// 			.catch(error => {
// 				done(error);
// 			});
// 	});

// 	it("Returns 400 status and 'password not provided' error message", (done) => {
// 		delete user.password;

// 		chai.request(app)
// 			.post(path)
// 			.set("content-type", "application/x-www-form-urlencoded")
// 			.send(user)
// 			.then(response => {
// 				expect(response).to.have.status(400);
// 				expect(response.body).to.have.property("message");
// 				expect(response.body.message).to.equal("password not provided");
// 				done();
// 			})
// 			.catch(error => {
// 				done(error);
// 			});
// 	});

// 	it("Returns 400 status and 'is_subscribed not provided' error message", (done) => {
// 		delete user.is_subscribed;

// 		chai.request(app)
// 			.post(path)
// 			.set("content-type", "application/x-www-form-urlencoded")
// 			.send(user)
// 			.then(response => {
// 				expect(response).to.have.status(400);
// 				expect(response.body).to.have.property("message");
// 				expect(response.body.message).to.equal("is_subscribed not provided");
// 				done();
// 			})
// 			.catch(error => {
// 				done(error);
// 			});
// 	});

// 	it("Returns 400 status and 'category not provided' error message", (done) => {
// 		delete user.category;

// 		chai.request(app)
// 			.post(path)
// 			.set("content-type", "application/x-www-form-urlencoded")
// 			.send(user)
// 			.then(response => {
// 				expect(response).to.have.status(400);
// 				expect(response.body).to.have.property("message");
// 				expect(response.body.message).to.equal("category not provided");
// 				done();
// 			})
// 			.catch(error => {
// 				done(error);
// 			});
// 	});

// 	it("Returns 400 status and 'subcategories not provided' error message", (done) => {
// 		delete user.subcategories;

// 		chai.request(app)
// 			.post(path)
// 			.set("content-type", "application/x-www-form-urlencoded")
// 			.send(user)
// 			.then(response => {
// 				expect(response).to.have.status(400);
// 				expect(response.body).to.have.property("message");
// 				expect(response.body.message).to.equal("subcategories not provided");
// 				done();
// 			})
// 			.catch(error => {
// 				done(error);
// 			});
// 	});

// 	it("Returns 400 status and 'Invalid email' error message", (done) => {
// 		user.email = "jabernall24gmail.com";

// 		chai.request(app)
// 			.post(path)
// 			.set("content-type", "application/x-www-form-urlencoded")
// 			.send(user)
// 			.then(response => {
// 				expect(response).to.have.status(400);
// 				expect(response.body).to.have.property("message");
// 				expect(response.body.message).to.equal("Invalid email");
// 				done();
// 			})
// 			.catch(error => {
// 				done(error);
// 			});
// 	});

// 	it("Returns 400 status and 'Invalid category' error message", done => {
// 		user.category = "kasjdnfa";

// 		chai.request(app)
// 			.post(path)
// 			.set("content-type", "application/x-www-form-urlencoded")
// 			.send(user)
// 			.then(response => {
// 				expect(response).to.have.status(400);
// 				expect(response.body).to.have.property("message");
// 				expect(response.body.message).to.equal("Invalid category");
// 				done();
// 			})
// 			.catch(error => {
// 				done(error);
// 			});
// 	});

// 	it("Returns 400 status and 'Email already exists' error message", done => {
// 		user.email = "test6@gmail.com";

// 		chai.request(app)
// 			.post(path)
// 			.set("content-type", "application/x-www-form-urlencoded")
// 			.send(user)
// 			.then(response => {
// 				expect(response).to.have.status(400);
// 				expect(response.body).to.have.property("message");
// 				expect(response.body.message).to.equal("Email already exists");
// 				done();
// 			})
// 			.catch(error => {
// 				done(error);
// 			});
// 	});

// });