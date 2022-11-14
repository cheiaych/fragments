// tests/unit/get.test.js

const request = require('supertest');
const MarkdownIt = require ('markdown-it');

const app = require('../../src/app');

describe('GET /v1/fragments', () => {
  beforeAll(async () => {
    const testPost1 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a plaintext test')
  });

  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).get('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).get('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair should give a success result with a fragments array
  test('authenticated users get a fragments array', async () => {
    const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body['fragments'])).toBe(true);
  });

  //Testing GET /v1/fragments/?expand=1
  // Using a valid username/password pair should give a success result with an expanded fragments array
  test('authenticated users get an array of expanded fragments', async () => {
    const res = await request(app).get('/v1/fragments/?expand=1').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body['fragments'])).toBe(true);
  })

  //Incorrect authentication passes 401 error
  test('authenticated users get an array of expanded fragments', async () => {
    const res = await request(app).get('/v1/fragments/?expand=1').auth('invalid@email.com', 'incorrect_password').expect(401);
  })
  // TODO: we'll need to add tests to check the contents of the fragments array later
});

describe('GET /v1/fragments/:id', () => {

  const jsonData = {
    text: 'this is a JSON test'
  };

  var id = [];
  //Generate a fragment to test search with
  beforeAll(async () => {
    const testPost1 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a plaintext test')
    id.push(testPost1.body['fragment']['id']);

    const testPost2 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(jsonData))
    id.push(testPost2.body['fragment']['id']);

    const testPost3 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send('#This is a markdown test')
    id.push(testPost3.body['fragment']['id']);

    const testPost4 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/html')
      .send('<h1>This is an HTML test</h1>')
    id.push(testPost4.body['fragment']['id']);
  })  

  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).get('/v1/fragments/' + id[0]).expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).get('/v1/fragments/' + id[0]).auth('invalid@email.com', 'incorrect_password').expect(401));

  // Valid username/password with existing fragment should return fragment
  test('authenticated user gets an existing fragment by id (text/plain type)', async () => {
    const res = await request(app).get('/v1/fragments/' + id[0]).auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect((res.body['data'])).toBeDefined();
  });

  test('authenticated user gets an existing fragment by id (application/json type)', async () => {
    const res = await request(app).get('/v1/fragments/' + id[1]).auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect((res.body['data'])).toBeDefined();
  });

  test('authenticated user gets an existing fragment by id (text/markdown type)', async () => {
    const res = await request(app).get('/v1/fragments/' + id[2]).auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect((res.body['data'])).toBeDefined();
  });

  test('authenticated user gets an existing fragment by id (text/html type)', async () => {
    const res = await request(app).get('/v1/fragments/' + id[3]).auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect((res.body['data'])).toBeDefined();
  });

  //Testing get /fragments/:id.ext for conversion
  /*test('authenticated user gets an existing fragment by id and valid conversion (text/plain type)', async () => {
    const res = await request(app).get('/v1/fragments/' + id[0] + '.txt').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect((res.body['data'])).toBe('This is a plaintext test');
  });

  test('authenticated user gets an existing fragment by id and valid conversion (application/json type)', async () => {
    const res = await request(app).get('/v1/fragments/' + id[1] + '.json').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body['data']['data']).toBe(jsonData);
  });*/

  test('authenticated user gets an existing fragment by id and valid conversion (text/markdown type)', async () => {
    var mdi = new MarkdownIt();
    const res = await request(app).get('/v1/fragments/' + id[2] + '.html').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect((res.body['data'])).toBe(mdi.render('#This is a markdown test'));
  });

  /*test('authenticated user gets an existing fragment by id and valid conversion (text/html type)', async () => {
    const res = await request(app).get('/v1/fragments/' + id[3] + '.html').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect((res.body['data'])).toBe('<h1>This is an HTML test</h1>');
  });*/

  //Testing invalid extension
  /*test('authenticated user gets an existing fragment by id but invalid conversion (text/plain type)', async () => {
    const res = await request(app).get('/v1/fragments/' + id[0] + '.md').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(415);
  });

  test('authenticated user gets an existing fragment by id but invalid conversion (application/json type)', async () => {
    const res = await request(app).get('/v1/fragments/' + id[1] + '.md').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(415);
  });*/

  test('authenticated user gets an existing fragment by id but invalid conversion (text/markdown type)', async () => {
    const res = await request(app).get('/v1/fragments/' + id[2] + '.json').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(415);
  });

  /*test('authenticated user gets an existing fragment by id but invalid conversion (text/html type)', async () => {
    const res = await request(app).get('/v1/fragments/' + id[3] + '.md').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(415);
  });*/

  // Valid username/password with non-existant fragment should return 404
  test('authenticated user gets a non-existant fragment by id', async () => {
    const res = await request(app).get('/v1/fragments/thisFragmentDoesntExist').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(404);
  });

  //Testing /v1/fragments/:id/info
  // Valid username/password with existing fragment should return fragment's metadata
  test('authenticated user gets an existing fragment by id with info', async () => {
    const res = await request(app).get('/v1/fragments/' + id[0] + '/info').auth('user1@email.com', 'password1');
    console.log(res.body)
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect((res.body)).toBeDefined();
  });

  // TODO: we'll need to add tests to check the contents of the fragments array later
});
