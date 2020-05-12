#!/usr/bin/env node
const express = require('express');
const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const http = require('http');

const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const STAGING_ENVIRONMENT = 'staging';
const PRODUCTION_ENVIRONMENT = 'prod';

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


/*

`POST /scores/:challengeId`

ip_address
name varchar(100)


`GET /scores/:challengeId`
*/
const server = app.listen(process.env.PORT || 5000, function() {
		/**
		 * The TFE expects keep-alive connections to remain open forever. Expressjs defaults to a
		 * timeout of 2 minutes. This causes many ChannelClosedExceptions for the TFE.
		 */
    server.setTimeout(0)

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
