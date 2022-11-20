const request = require('supertest');

const app = require('../../src/app');

describe('POST /v1/fragments', () => {
  test('Authenticated user posting valid fragment', async () => {
      const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send("This is a test")
      expect(res.statusCode).toBe(201);
      //var test = res.headers['location'];
      expect(typeof(res.headers['location'])).toBeDefined();
      //var testTwo = res.body['fragment'];
      expect(res.body['fragment']).toBeDefined();
    });

    test('Authenticated user cannot post an invalid typed fragment', async () => {
      const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/msword')
      .send("This is a test");
      expect(res.statusCode).toBe(415);
    });

  test('Unauthenticated user cannot access post route', async () => {
    const res = await request(app)
    .post('/v1/fragments')
    .auth('invalid@email.com', 'incorrect_password')
    .set('Content-Type', 'text/plain')
    .send("This is a test")
    expect(res.statusCode).toBe(401);
   });
});
