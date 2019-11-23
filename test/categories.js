
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const app = require('../app');

describe('/categories', () => {
    it('Returns a 200 response', (done) => {
        chai.request(app)
            .get('/categories')
            .end((error, response) => {
                if (error) done(error);
                // Now let's check our response
                expect(response).to.have.status(200);
                done();
            });
    });
});

describe('/categories/alskjdnfa', () => {
    it('Returns a 400 response', (done) => {
        chai.request(app)
            .get('/categories/alskjdnfa')
            .end((error, response) => {
                if(error) done(error);

                expect(response).to.have.status(400);
                done();
            });
    });
});

describe('/categories/computer science', () => {
    it('Returns a 200 response', (done) => {
        chai.request(app)
            .get('/categories/computer science')
            .end((error, response) => {
                if(error) done(error);

                expect(response).to.have.status(200);
                done();
            });
    });
});

// describe('/categories/computer science', () => {
//     it('Returns a list of subcategories', (done) => {
//         chai.request(app)
//             .get('/categories/computer science')
//             .end((error, response) => {
//                 if(error) done(error);

//                 expect(response).to.have
//                 done();
//             });
//     });
// });