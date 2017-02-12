'use strict';

var clientOperation = function () {  
};

var clienttodatabase = require('./dbfunctions/clienttodatabase.js');
var clientToDB = new clienttodatabase();

// authentication of the client
clientOperation.prototype.authentication = function (params, response) {
	if (params.username && params.password) {
		response(null, params);
	} else{
		response(false);
	}
};

// client connected save into the dBase
clientOperation.prototype.clientConnected = function (client, response) {
	clientToDB.userAuthentication(client, function (err, res) {
		if(!err) {
			log('Client authenticated in the DB');
			response(null, res);
		} else {
			log('Client authenticcation in DB failes');
			response(err, null);
		}
	});
};

// registration of the client
clientOperation.prototype.registration = function (params, response) {
	clientToDB.userRegistration(params, function (err, res) {
		if (err) {
			response(null, res);
		} else {
			response(err, null);
		}
	});
};

// process the message from the client
clientOperation.prototype.processMessage = function (connections, from, message) {
	log('processing message');

	if (message.is('presence')) {
		log('prsence of the client updated', client.jid);
		updatePresence(client.jid.local, message.attrs.status);
	} else if (message.is('message')) {
    	// Stanza handling
		var dest = message.attrs.to;
		message.attrs.from =  from;
		if (connections[dest]) {
			(connections[dest]).send(message);
            log('message sent to', dest);
		}
		clientToDB.saveMessage(message.attrs);
	}
};

clientOperation.prototype.updatePresence = function (user, presence) {
	log('presence of the user' + user + 'is updated to', presence);
};

module.exports = clientOperation;

/**
* function for debugging usage
**/
var log = function (message, value) {
	var date = new Date();
	date = date.getHours() +  ':' + date.getMinutes() + ':'
	 + date.getSeconds() + ':' + date.getMilliseconds() + '\t';

	if (value) {
		if (typeof(value) === 'object') {
			console.log(date + '- Client Operation: ' + message + ':');
			console.log(value);
		} else {
			console.log(date + '- Client Operation: ' + message + ':' + value.toString());
		}
	} else {
		console.log(date + '- Client Operation: ' + message);
	}
};


