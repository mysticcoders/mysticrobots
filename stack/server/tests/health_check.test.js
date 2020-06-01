const { app } = require('../index')
const supertest = require('supertest')
const request = supertest(app)

describe('Ensure health check returns OK', () => {

    it('should return a 200 when GET /health', async (done) => {

        await request
            .get('/health')
            .expect(200)

        done()
    })

})