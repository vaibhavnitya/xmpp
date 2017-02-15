'use strict';

var clientOperation = function () {  
};

var clienttodatabase = require('./dbfunctions/clienttodatabase.js');
var clientToDB = new clienttodatabase();

// authentication of the client
clientOperation.prototype.authentication = function (clientOptions, callback) {
	var authData = {
		'username': clientOptions.username,
		'password': clientOptions.password
	};
	if (authData.username && authData.password) {
		log('Client trying to authenticate', clientOptions.jid);
		clientToDB.userAuthentication(authData, function (err, res) {
			if(!err) {
				log('Client authenticated in the DB');
				callback(null, res);
			} else {
				log('Client authentication in DB failed');
				callback('err', null);
			}
		});
	} else{
		log('Client connection failure', clientOptions.jid);
		callback('err', null);
	}
};

// client connected save into the dBase
clientOperation.prototype.clientConnected = function (client, response) {
	
};

// registration of the client
clientOperation.prototype.registration = function (params, response) {
	clientToDB.userRegistration(params, function (err, res) {
		if (!err) {
			response(null, res);
		} else {
			response('err', null);
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
		if(message.attrs && message.attrs.type === 'chat' && message.attrs.message.length && message.attrs.message.length < 250) {
			var dest = message.attrs.to;
			message.attrs.from =  from;
			message.attrs.time = (new Date()).getTime(); 
			if (connections[dest]) {
				(connections[dest]).send(message);
				log('message sent to', dest);
			}
			clientToDB.saveMessage(message.attrs);
		} else if(message.attrs.type === 'getHistory'){
			var filter = [from, message.attrs.to, message.attrs.time];
			clientToDB.getMessages(filter, function (err, res) {
				if (!err) {
					if (connections[from]) {
						message.attrs.type = 'history';
						message.attrs.to = from;
						message.attrs.from = 'server';
						message.attrs.messages = JSON.stringify(res);
						(connections[from]).send(message);
						log('Successfully sent history messages to the client', from);
					}
				}
			});
		}
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


