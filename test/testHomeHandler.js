require('dotenv').load();
const chai = require('chai');
const homeHandler = require('../server/homeHandler.js');

const should = chai.should();

describe('home handler', () => {

  it('should respond to GET /ping', async () => {
    const response = await homeHandler.ping();
    response.should.have.property('statusCode').equal(200);
  });

  it('should respond with a token to POST /login', async () => {
    const event = { body: JSON.stringify({ email: 'darth.vader@gmail.com', password: 'anakin' })};
    const response = await homeHandler.login(event);
    response.should.have.property('statusCode').equal(200);
    const body = JSON.parse(response.body);
    body.should.have.property('status').equal('success');
    body.data.should.have.property('token');
  });

});