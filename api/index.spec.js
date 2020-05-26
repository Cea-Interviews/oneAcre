import request from 'supertest';
import server from  './index';

describe('server.js', () => {
    it('should return status 200', async() => {
        const expectedStatus = 200
        const response = await request(server).get('/');
        expectedStatus(response.status).toEqual(200)
    })
})