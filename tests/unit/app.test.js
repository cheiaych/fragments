const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments', () => {
    //If user is authenticated but attempts to access non-existant page, should return 404 error
    test('Authenticated user accessing non-existant pages return a 404 error', async () => {
        const res = await request(app).get('/v1/fragments/nonexistant-page').auth('user1@email.com', 'password1');
        expect(res.statusCode).toBe(404);
    });
});