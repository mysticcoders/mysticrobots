#!/usr/bin/env node
const express = require('express');
const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const http = require('http');

const bodyParser = require('body-parser');
const cors = require('cors');

const { board } = require('common')

const {
    name:APP_NAME,
    version:APP_VERSION
} = require('./package.json')

const app = express();

const STAGING_ENVIRONMENT = 'staging';
const PRODUCTION_ENVIRONMENT = 'prod';
const SERVER_PORT = process.env.PORT || 5000

// Set up basic access logging with file rotation:
app.use(morgan('combined', {stream: rfs.createStream('access.log', {maxFiles: 5, size: '100M'})}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
};

app.options('*', cors(corsOptions))

/**
 * Mimic the finagle lifecycle management endpoints.
 */

app.get('/health', require('./routes/health_check'));

app.get('/challenges', cors(corsOptions), require('./routes/get_challenges'))

app.get('/challenges/:id', cors(corsOptions), require('./routes/get_challenges_by_id'))

app.get('/puzzles/:challengeId', cors(corsOptions), require('./routes/get_puzzles_by_challenge_id'))

app.get('/scores/:challengeId', cors(corsOptions), require('./routes/get_scores_by_challenge_id'))

app.post('/scores/:challengeId', cors(corsOptions), require('./routes/save_score_by_challenge_id'))

const server = app.listen(SERVER_PORT, function() {
		/**
		 * The TFE expects keep-alive connections to remain open forever. Expressjs defaults to a
		 * timeout of 2 minutes. This causes many ChannelClosedExceptions for the TFE.
		 */
    server.setTimeout(0)
    console.log(`${APP_NAME} v${APP_VERSION} listening on ${SERVER_PORT}`)

    /**
     * Node's default behavior is to close the connection on upgrade requests. The HTTP2 spec
     * prefers that servers that do not support HTTP2 return a normal HTTP response, without
     * HTTP2 headers. This is another source of TFE ChannelClosedExceptions, as well as
     * com.twitter.io.ReaderDiscardedException stream failures.
     *
     * See https://phabricator.twitter.biz/D188570 for a very detailed explanation.
     *
     * Note: This will be unneccessary if/when we upgrade to node v10.
     */
    server.on('upgrade', (req, sock, head) => {
        const res = new http.ServerResponse(req);

        sock.on('drain', () => {
            res.emit('drain');
        });

        res.assignSocket(sock);

        res.on('finish', () => {
            res.detachSocket(sock);
            sock.end();
        });

        server.emit('request', req, res);
   });

});
