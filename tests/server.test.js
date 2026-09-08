const request = require('supertest');
const app = require('../server');

describe('API Tests', () => {
    afterEach(() => {
        jest.useRealTimers();
    });

    test('GET /api/memos should return 200 and an array', async () => {
        const res = await request(app).get('/api/memos');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    test('POST /api/memos should add a new memo successfully', async () => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2026-09-06T14:30:00'));

        const res = await request(app)
            .post('/api/memos')
            .send({ text: 'CI/CD test execution' });

        expect(res.statusCode).toEqual(201);
        expect(res.body.text).toEqual('2026/09/06 14:30 CI/CD test execution');
    });

    test('GET /api/memos should return memo text with timestamp prefix as stored', async () => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2026-09-06T14:30:00'));

        await request(app)
            .post('/api/memos')
            .send({ text: 'テスト投稿です' });

        const res = await request(app).get('/api/memos');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    text: '2026/09/06 14:30 テスト投稿です'
                })
            ])
        );
    });

    test('DELETE /api/admin/memos/:id should delete an existing memo for admin', async () => {
        const createRes = await request(app)
            .post('/api/memos')
            .send({ text: '削除対象メモ' });

        const deleteRes = await request(app)
            .delete(`/api/admin/memos/${createRes.body.id}`)
            .set('x-admin', 'true');

        expect(deleteRes.statusCode).toEqual(200);
        expect(deleteRes.body.id).toEqual(createRes.body.id);

        const listRes = await request(app).get('/api/memos');
        expect(listRes.body).not.toEqual(
            expect.arrayContaining([
                expect.objectContaining({ id: createRes.body.id })
            ])
        );
    });

    test('DELETE /api/admin/memos/:id should return 403 when admin header is missing', async () => {
        const createRes = await request(app)
            .post('/api/memos')
            .send({ text: '権限チェック用メモ' });

        const deleteRes = await request(app)
            .delete(`/api/admin/memos/${createRes.body.id}`);

        expect(deleteRes.statusCode).toEqual(403);
    });
});