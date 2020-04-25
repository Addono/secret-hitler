'use strict';

var https = require('https');
var fs = require('fs');

const express = require('express');
require('dotenv').config();
const port = (() => {
	const val = process.env.PORT || '8080';
	const port = parseInt(val, 10);

	if (isNaN(port)) {
		return val;
	}

	if (port >= 0) {
		return port;
	}

	return false;
})();

global.app = express();

var options = {
  key: fs.readFileSync('certs/privkey.pem'),
  cert: fs.readFileSync('certs/cert.pem'),
  ca: fs.readFileSync('certs/chain.pem')
};

const debug = require('debug')('app:server');
const server = https.createServer(options, app);

global.io = require('socket.io')(server);
global.notify = require('node-notifier');

app.set('port', port);
app.set('strict routing', true);
server.listen(port);

function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use');
			process.exit(1);
			break;
		default:
			throw error;
	}
}

function onListening() {
	const addr = server.address();
	const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
	debug('Listening on ' + bind);
	console.log('Listening on ' + bind);
	require('../app');
}

server.on('error', onError);
server.on('listening', onListening);
