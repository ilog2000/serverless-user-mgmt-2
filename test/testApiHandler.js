require('dotenv').load();
const chai = require('chai');
const apiHandler = require('../server/apiHandler.js');
const homeHandler = require('../server/homeHandler.js');

const should = chai.should();

describe('api handler', () => {
  let token;
  before(async () => {
    const event = { body: JSON.stringify({ email: 'darth.vader@gmail.com', password: 'anakin' }) };
    const response = await homeHandler.login(event);
    const payload = JSON.parse(response.body);
    token = payload.data.token;
  });

  it('should respond with users to GET /api/v1/users', async () => {
    const event = {
      headers: { Authorization: "Bearer " + token },
    };
    const context = {};
    const response = await apiHandler.getUsers(event, context);
    response.should.have.property('statusCode').equal(200);
    const body = JSON.parse(response.body);
    body.should.have.property('status').equal('success');
    body.data.should.have.property('Items');
    body.data.Items.should.be.an('array');
  });

  it('should respond with users to GET /api/v1/users/{id}', async () => {
    const event = {
      headers: { Authorization: "Bearer " + token },
      pathParameters: { id: 'fae0fb30-c6ec-11e8-9bd5-e358ca4b1f07' }
    };
    const context = {};
    const response = await apiHandler.getUser(event, context);
    response.should.have.property('statusCode').equal(200);
    const body = JSON.parse(response.body);
    body.should.have.property('status').equal('success');
    body.data.should.have.property('Item');
    body.data.Item.should.be.an('object');
    body.data.Item.should.have.property('email').equal('darth.vader@gmail.com');
  });

});