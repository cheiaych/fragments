// tests/unit/delete.test.js

const request = require('supertest');
const MarkdownIt = require ('markdown-it');

const app = require('../../src/app');

describe('DELETE /v1/fragments', () => {
  var id;
  beforeAll(async () => {
    const testPost1 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a plaintext test')
      id = testPost1.body['fragment']['id'];
  });

  test('unauthenticated user cannot delete a fragment', async () => {
    const res = await request(app).delete('/v1/fragments/' + id).auth('invalid@email.com', 'incorrect_password')
    expect(res.statusCode).toBe(401);
  });

  test('authenticated user cannot delete a fragment that does not exist', async () => {
    const res1 = await request(app).delete('/v1/fragments/deos-not-exist').auth('user1@email.com', 'password1');
    expect(res1.statusCode).toBe(404);
  });

  test('authenticated user cannot delete another users fragment', async () => {
    const res1 = await request(app).delete('/v1/fragments/' + id).auth('user2@email.com', 'password2');
    expect(res1.statusCode).toBe(404);

    const res2 = await request(app).get('/v1/fragments/' + id).auth('user1@email.com', 'password1');
    expect(res2.statusCode).toBe(200);
  });

  test('authenticated user deletes an existing fragment', async () => {
    const res1 = await request(app).delete('/v1/fragments/' + id).auth('user1@email.com', 'password1');
    expect(res1.statusCode).toBe(200);

    const res2 = await request(app).get('/v1/fragments/' + id).auth('user1@email.com', 'password1');
    expect(res2.statusCode).toBe(404);
  });
});
