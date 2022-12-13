// tests/unit/put.test.js

const request = require('supertest');
const MarkdownIt = require ('markdown-it');

const app = require('../../src/app');

describe('PUT /v1/fragments', () => {
  var id;
  beforeAll(async () => {
    const testPost1 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a plaintext test')
      id = testPost1.body['fragment']['id'];
  });

  test('unauthenticated user cannot update fragment', async () => {
    const res = await request(app).put('/v1/fragments/' + id)
    .auth('invalid@email.com', 'incorrect_password')
    .set('Content-Type', 'text/plain')
    .send('This is an updated plaintext test')
    expect(res.statusCode).toBe(401);
  });

  test('authenticated user cannot update fragment that does not exist', async () => {
    const res = await request(app).put('/v1/fragments/does-not-exist')
    .auth('user1@email.com', 'password1')
    .set('Content-Type', 'text/plain')
    .send('This is an updated plaintext test')
    expect(res.statusCode).toBe(404);
  });

  test('authenticated user cannot update an existing fragment using a different type', async () => {
    const res1 = await request(app).put('/v1/fragments/' + id)
    .auth('user1@email.com', 'password1')
    .set('Content-Type', 'text/markdown')
    .send('This is an updated plaintext test')
    expect(res1.statusCode).toBe(400);
    
    const res2 = await request(app).get('/v1/fragments/' + id).auth('user1@email.com', 'password1');
    expect(res2.statusCode).toBe(200);
    expect(res2.text).toBe('This is a plaintext test');
    expect(res2.type).toBe('text/plain');
  });

  test('authenticated user cannot update another users fragment', async () => {
    const res1 = await request(app).put('/v1/fragments/' + id)
    .auth('user2@email.com', 'password2')
    .set('Content-Type', 'text/plain')
    .send('This is an updated plaintext test')
    expect(res1.statusCode).toBe(404);
    
    const res2 = await request(app).get('/v1/fragments/' + id).auth('user1@email.com', 'password1');
    expect(res2.statusCode).toBe(200);
    expect(res2.text).toBe('This is a plaintext test');
    expect(res2.type).toBe('text/plain');
  });

  test('authenticated user updates an existing fragment', async () => {
    const res1 = await request(app).put('/v1/fragments/' + id)
    .auth('user1@email.com', 'password1')
    .set('Content-Type', 'text/plain')
    .send('This is an updated plaintext test')
    expect(res1.statusCode).toBe(200);
    
    const res2 = await request(app).get('/v1/fragments/' + id).auth('user1@email.com', 'password1');
    expect(res2.statusCode).toBe(200);
    expect(res2.text).toBe('This is an updated plaintext test');
    expect(res2.type).toBe('text/plain');
  });
});
