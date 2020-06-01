#!/usr/bin/env node
const express = require('express');
const morgan = require('morgan');
const rfs = require('rotating-file-stream');

const bodyParser = require('body-parser');
const cors = require('cors');
const { knexSnakeCaseMappers, Model } = require('objection')
const Knex = require('knex')

const common = require('common')

const { board } = require('common')

const {
    name:APP_NAME,
    version:APP_VERSION
} = require('./package.json')

const app = express();

const TEST_ENVIRONMENT = 'test';
const STAGING_ENVIRONMENT = 'staging';
const PRODUCTION_ENVIRONMENT = 'prod';

const SERVER_PORT = process.env.NODE_ENV === 'test' ? 5001 : 5000

const knex = Knex({
    client: 'pg',
    connection: process.env.PG_CONNECTION_STRING,
    ...knexSnakeCaseMappers()
})

Model.knex(knex)

// Turn on for debug mode
// 
// knex.on('query', (queryData) => {
//     console.log(queryData)
// })

const whitelist = ['localhost', 'mysticrobots.com', 'mysticrobots.netlify.com', 'mysticrobots-staging.netlify.com']
const corsOptions = {
    origin: (origin, callback) => {
        if(typeof(origin) === 'undefined') {
            callback(null, true);
        } else if (whitelist.some(function(v) { return origin.indexOf(v) >= 0; })) {
            callback(null, true)
        } else {
            callback(null, false)
        }
    }
}

app.options('*', cors(corsOptions))

// Set up basic access logging with file rotation:
app.use(morgan('combined', {stream: rfs.createStream('access.log', {maxFiles: 5, size: '100M'})}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/health', require('./routes/health_check'));
app.use('/challenges', require('./routes/challenges'))
app.use('/puzzles', require('./routes/puzzles'))
app.use('/scores', require('./routes/scores'))

const server = app.listen(SERVER_PORT)

module.exports = { app, server }