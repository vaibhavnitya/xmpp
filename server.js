'use strict';

var Server = require('node-xmpp-server').C2S.WebSocketServer;

var PORT = 7777;
var server;

server = new Server({
	port: PORT,
	domain: 'localhost'
});

server.on('connection', function (client) {

	// Allows the developer to register the jid against anything they want
    client.on('register', function (opts, cb) {
  		log('register the client', opts.jid);
  		registration(opts, cb);
    });

	// Allows the developer to authenticate the user
	client.on('authenticate', function (opts, cb) {
		log('client trying to authenticate. JID', opts.jid);
		authentication(opts, cb);
	});

	// when a client is online
	client.on('online', function () {
    	log('client STATUS is online', client.jid.local);
    });

    // When client sends a message. Handling the stanza
    client.on('stanza', function (stanza) {
    	log('received message from the client', stanza);
    	processMessage(client, stanza);
    });

	// On Disconnect event. When a client disconnects
    client.on('disconnect', function () {
    	log('client is diconnected', client.jid.local);
    });
});

server.on('listening', function (par) {
	log('server is listening on port', PORT);
});

server.on('online', function (par) {
	log('server is online now');
});

/**
* Server functions to be performed on the client
**/
// authentication of the client
var authentication = function (params, response) {
	if (params.username && params.password) {
		response(null, params);
	} else{
		response(false);
	}
};

// registration of the client
var registration = function (params, response) {
	response(true);
};

// process the message from the client
var processMessage = function (client, message) {
	log('processing message');

	if (message.is('presence')) {
		log('prsence of the client updated', client.jid);
		updatePresence(client.jid.local, message.attrs.status);
	} else if (message.is('message')) {
    	// Stanza handling
	    var from = message.attrs.from;
	    message.attrs.from = message.attrs.to;
	    message.attrs.to = from;
	    client.send(message);
	}
};

var updatePresence = function (user, presence) {
	log('presence of the user' + user + 'is updated to', presence);
};

/**
* function for debugging usage
**/
var log = function (message, value) {
	var date = new Date();
	date = date.getHours() +  ':' + date.getMinutes() + ':'
	 + date.getSeconds() + ':' + date.getMilliseconds() + '\t';

	if (value) {
		if (typeof(value) === 'object') {
			console.log(date + '- server: ' + message + ':');
			console.log(value);
		} else {
			console.log(date + '- server: ' + message + ':' + value.toString());
		}
	} else {
		console.log(date + '- server: ' + message);
	}
};