const request = require('supertest');
const app = require('../server');

describe('API Tests', () => {
    test('GET /api/memos should return 200 and an array', async () => {
        const res = await request(app).get('/api/memos');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    test('POST /api/memos should add a new memo successfully', async () => {
        const res = await request(app)
            .post('/api/memos')
            .send({ text: 'CI/CD test execution' });
        expect(res.statusCode).toEqual(201);
        expect(res.body.text).toEqual('CI/CD test execution');
    });
});