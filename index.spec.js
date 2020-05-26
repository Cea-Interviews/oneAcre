const request = require('supertest');
const server = require('./index');

describe('index.js', () => {
    it('should listen on port', function(){
        const res = server.listen(3600)
        expect(res.listening).toEqual(true)
    })
    it('should return status 200', async function(){
        const expectedStatus = 200
        const response = await request(server).get('/');
        expect(response.status).toEqual(expectedStatus)
    })
})