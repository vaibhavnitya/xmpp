'use strict';

var express= require('express');
var bodyParser = require('body-parser');
var httpServer = express();

var Server = require('node-xmpp-server').C2S.WebSocketServer;

var dataBbase = require('./database.js');
var dBase = new dataBbase();

var clientOperation = require('./clientOperations.js');
var clientOps = new clientOperation();

var xmppPORT = 7777;
var httpPORT = 5050;
var server;

var connections = [];

httpServer.use(express.static(__dirname));

httpServer.set('views', __dirname +'/views');
httpServer.set('view engine', 'ejs');
httpServer.engine('html', require('ejs').renderFile);

httpServer.listen(httpPORT, function() {
    log('HTTP server listening at port', httpPORT);
});

httpServer.get('/', function(req,res){
    res.render('home');
});

dBase.initiateDatabase(function (err, dBase) {
	if(err) {
		process.exit(1);
	}
});

server = new Server({
	port: xmppPORT,
	domain: 'localhost'
});

server.on('connection', function (client) {
	
	// Allows the developer to register the jid against anything they want
    client.on('register', function (opts, cb) {
  		log('register the client', opts.jid);
  		clientOps.registration(opts, cb);
    });

	// Allows the developer to authenticate the user
	client.on('authenticate', function (opts, cb) {
		log('client trying to authenticate. JID', opts.jid);
		clientOps.authentication(opts.jid, cb);
	});

	// when a client is online
	client.on('online', function () {
    	log('client STATUS is online', client.jid.user);
		connections[client.jid.user] = client;
    });

    // When client sends a message. Handling the stanza
    client.on('stanza', function (stanza) {
    	log('received message from the client', stanza.attrs);
    	clientOps.processMessage(connections, client.jid.user, stanza);
    });

	// On Disconnect event. When a client disconnects
    client.on('disconnect', function () {
    	log('client is diconnected', client.jid.local);
    });
});

server.on('listening', function (par) {
	log('server is listening on port', xmppPORT);
});

server.on('online', function (par) {
	log('server is online now');
});

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