const { app } = require('../index')
const supertest = require('supertest')
const request = supertest(app)
const moment = require('moment')

const config = {
    client: 'pg',
    // debug: true,
    connection: {
      host: 'localhost',
      port: '5432',
      password: 'password',
      user: 'admin',
      database: 'postgres'
    },
    migrations: {
      directory: '../../node_modules/common/migrations'
    },
    seeds: {
      directory: '../../node_modules/common/seeds'
    }
  };

beforeAll(async () => {
    const knex = require('knex')(config)

    try {
        await knex.raw('CREATE DATABASE mysticrobots_test')
    } catch (err) {
        console.error(err)
    } finally {
        await knex.destroy()
    }
})

afterAll(async () => {
    const knex = require('knex')(config)

    try {
        await knex.raw('DROP DATABASE IF EXISTS mysticrobots_test')
    } catch(err) {
        console.error(err)
    } finally {
        await knex.destroy()
    }
})

describe('Should test fetching and updating challenges', () => {

    const knex = require('knex')(config)

    beforeAll(async () => {
        return await knex.migrate.latest()
    })

    afterAll(async () => {
        await knex.migrate.rollback()
        return await knex.destroy()
    })

    it('should return challenges in the database', async (done) => {

        const Challenge = require('common').models.Challenge


        const challengeId = Challenge.query().insert({
            startTime: moment().valueOf(),
            endTime: moment().valueOf()
        })

        const res = await request
            .get(`/challenges/${challengeId}`)
            .expect('Content-Type', /json/)
            .expect(200)            

        console.dir(res)
        done()
    })
})