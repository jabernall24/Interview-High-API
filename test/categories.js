
const chai = require("chai");
const expect = chai.expect;
const chaiHttp = require("chai-http");

chai.use(chaiHttp);

const app = require("../app").app;

describe("/categories", () => {
	it("Returns a 200 response when everything is fine", (done) => {
		chai.request(app)
			.get("/categories")
			.then(response => {
				expect(response).to.have.status(200);
				done();
			})
			.catch(error => {
				done(error);
			});
	});
});

describe("/categories/:category", function() {

	it("Returns a 400 response when category is invalid", (done) => {
		chai.request(app)
			.get("/categories/alskjdnfa")
			.then(response => {
				expect(response).to.have.status(400);
				done();
			})
			.catch(error => {
				done(error);
			});
	});

	it("Returns a 200 response when valid category is passed", (done) => {
		chai.request(app)
			.get("/categories/computer science")
			.then(response => {
				expect(response).to.have.status(200);
				done();
			})
			.catch(error => {
				done(error);
			});
	});
});