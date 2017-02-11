'use strict';

var async = require('async');

var tokendatabase = require('./tokendatabase.js');
var dbtoken = new tokendatabase();

var userDatabase = function () {
};

var dbUsers;
var collectionUser = 'user';

/**
 * To initiate the user database
 * @method userDatabase.initiate Initiates the user database
 * @param databaseObject 
 * @return null
 *  */
userDatabase.prototype.initiate = function (dab) {
    dbUsers = dab;
    dbtoken.initiate(dab);
};

/**
 * To create a new user in databse
 * @method userDatabase.createUser It greates new user based on parameters
 * @param userData Must have unique username(phone number), fname, lname, password
 * @return tokenOject Returns a token object
 *  */
userDatabase.prototype.createUser = function (userData, callback) {
    var now = (new Date()).getTime();
    dbUsers.collectionUser.update(
        {'username' : userData.username},
        {$set:
            {
                'username': userData.username,
                'fname': userData.fname,
                'lname': userData.lname,
                'created': now,
                'updated': now
            }
        },
        {
            upsert: true,
            multi: false
        }, function (err, res) {
            if (!err) {
                var tokenData = {'userId': res._id, 'password': userData.password};
                log('Created new user', userData);
                dbtoken.createToken(tokenData, function (err, newToken) {
                    if(!err) {
                        callback(null, newToken);
                    } else {
                        callback(err, null);
                    } 
                });
            } else {
                callback(err, null);
                log('Failed to create user', userData);
            }
        });
};

/**
 * To login a user
 * @method userDatabase.loginUser On user sign in
 * @param userData Must have unique username(phone number), password
 * @return tokenOject Returns a token object
 *  */
userDatabase.prototype.loginUser = function (userData, callback) {
    dbUsers.collectionUser.find(
        {'username' : userData.username},
        function (err, res) {
            if (!err) {
                var userId = {'userId': res._id, 'password': userData.password};
                dbtoken.validateUserAndGetToken(userId, function (err, token) {
                    if(!err) {
                        callback(null, token);
                    } else {
                        callback(err, null);
                    } 
                });
            } else {
                log('Could not find user', userData);
            }
        });
};

module.exports = userDatabase;

/**
* function for debugging usage
**/
var log = function (message, value) {
	var date = new Date();
	date = date.getHours() +  ':' + date.getMinutes() + ':'
	 + date.getSeconds() + ':' + date.getMilliseconds() + '\t';

	if (value) {
		if (typeof(value) === 'object') {
			console.log(date + '- Database server: User database: ' + message + ':');
			console.log(value);
		} else {
			console.log(date + '- Database server: User database: ' + message + ':' + value.toString());
		}
	} else {
		console.log(date + '- Database server: User database: ' + message);
	}
};