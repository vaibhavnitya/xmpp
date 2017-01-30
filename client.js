'use strict';

// modules required
var Client = require('node-xmpp-client');

// server details
var SERVER = 'ws://localhost';
var PORT = 7777;
var STATUS = 'online';

//Client model
var client;

// create a new client to login to the server
client = new Client({
  jid: 'sonny@localhost',
  password: 'foo',
  websocket: {
    url: SERVER + ':' + PORT
  }
});

// check if the client is connected to the server successfully
client.on('online', function () {
   console.log('client: Client is connected to the server');
   setTimeout(function(){
   	sendMessage();
   }, 5000);
});	

// checks if the client received any message from the server
client.on('stanza', function (stanza) {
	console.log('client: Received stanza: ' + stanza.toString());
});

// checks if the client is offline
client.on('offline', function () {
	console.log('client: Client is offline');
});

// tries to reconnect on client offline
client.on('reconnect', function () {
  console.log('client: Client reconnects …');
});

// checks if the client is disconnected and tries to reconnect
client.on('disconnect', function (e) {
	console.log('client: Client is disconnected', client.connection.reconnect, e);
});

// log if error on client
client.on('error', function (err) {
  console.error(err);
});

// close the client on process exit
process.on('exit', function () {
  client.end();
});


/**
* functions to communicate with the server
**/

// function to register to the server
var registerClient = function () {
  var stanza = new Client.Stanza('iq', {type: 'set', id: 'client1', to: SERVER})
   .c('query', {xmlns: 'jabber:iq:register'})
   .c('username').t('sonny@localhost').up()  // Give a username
   .c('password').t('foo');  // Give a password
   client.send(stanza); // send a stanza
};

// function to send presence to the server
var sendPresence = function () {
	client.send(new Client.Stanza('presence', {'status': STATUS}));
}

// function to send messages to the server
var sendMessage = function () {
	var message = new Client.Stanza('message', {
		to: 'client2',
        from: 'client1',
        type: 'chat'
	});
	message.c('body').t('chat').up({
		'this': 'body'
	});
	client.send(message);
}