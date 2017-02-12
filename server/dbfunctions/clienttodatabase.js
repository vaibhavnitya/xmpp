'use strict';

var async = require('async');

var clientToDatabase = function () {
};

var userdatabase = require('./userdatabase.js');
var dbUser = new userdatabase();

var tokendatabase = require('./tokendatabase.js');
var dbtoken = new tokendatabase();

var messagedatabase = require('./messagedatabase.js');
var dbmessage = new messagedatabase();

/**
 * Creates the user token on creation of the user
 * @method clientToDatabase.userRegistration User registration to DB
 * @param userData User data should contain username, fname, lname and password
 * @return Oject containing token
 *  */
clientToDatabase.prototype.userRegistration = function (userData, callback) {
    dbUser.createUser(userData, function (err, res) {
        if(!err) {
            callback(null, res);
        } else {
            log('Failed create user in DB', userData.userId);
        }
    });
};

/**
 * Authenticates the user against username password
 * @method clientToDatabase.userAuthentication User sign in to DB
 * @param userData User data should contain username and password
 * @return Oject containing token
 *  */
clientToDatabase.prototype.userAuthentication = function (userData, callback) {
    dbUser.loginUser(userData, function (err, res) {
        if(!err) {
            callback(null, res);
        } else {
            log('Failed to login the user', userData.userId);
            callback('err', null);
        }
    });
};

/**
 * Saves the message into DB
 * @method clientToDatabase.saveMessage Saves meassage to DB
 * @param userData User data should contain from, to, message
 * @return null
 *  */
clientToDatabase.prototype.saveMessage = function (messageData, callback) {
    dbmessage.saveMessage(messageData, function (err, res) {
        if(!err) {
            callback(null, res);
        } else {
            log('Failed to save message to DB', userData.userId);
        }
    });
};

/**
 * Get messages from DB
 * @method clientToDatabase.getMessages Gets meassages from DB
 * @param filterData User data should contain appropriate filter
 * @return messageObject contains messages
 *  */
clientToDatabase.prototype.getMessages = function (filterData, callback) {
    dbmessage.getMessages(filterData, function (err, res) {
        if(!err) {
            callback(null, res);
        } else {
            log('Failed to save message to DB', userData.userId);
        }
    });
};

module.exports = clientToDatabase;

/**
* function for debugging usage
**/
var log = function (message, value) {
	var date = new Date();
	date = date.getHours() +  ':' + date.getMinutes() + ':'
	 + date.getSeconds() + ':' + date.getMilliseconds() + '\t';

	if (value) {
		if (typeof(value) === 'object') {
			console.log(date + '- Database server: ClientToDatabase: ' + message + ':');
			console.log(value);
		} else {
			console.log(date + '- Database server: ClientToDatabase: ' + message + ':' + value.toString());
		}
	} else {
		console.log(date + '- Database server: ClientToDatabase: ' + message);
	}
};