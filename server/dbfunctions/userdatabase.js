'use strict';

var async = require('async');

var tokendatabase = require('./tokendatabase.js');
var dbtoken = new tokendatabase();

var userDatabase = function () {
};

var dbUsers = null;
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
    userDatabase.prototype.findUserByUsername (userData.username, function (err, user) {
        if(!err && user === null) {
            dbUsers.collection(collectionUser).insert(
                    {
                        'username': userData.username,
                        'fname': userData.fname,
                        'lname': userData.lname,
                        'created': now,
                        'updated': now
                    }, function (err, res) {
                    if (!err) {
                        var tokenData = {'userId': res.ops[0]._id, 'password': userData.password};
                        log('Created new user', userData);
                        dbtoken.createToken(tokenData, function (err, newToken) {
                            if(!err) {
                                callback(null, newToken);
                            } else {
                                callback('err', null);
                            } 
                        });
                    } else {
                        callback('err', null);
                        log('Failed to create user', userData);
                    }
                });
        } else {
            log('User already exists', userData.username);
            callback('err', null);
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
    dbUsers.collection(collectionUser).find(
        {'username' : userData.username},
        function (err, res) {
            if (!err) {
                res.toArray(function(err, users){
                    if(users.length > 0) {
                        var userId = {'userId': users[0]._id, 'password': userData.password};
                        dbtoken.validateUserAndGetToken(userId, function (err, token) {
                            if(!err) {
                                log('Successfully authenticated', users[0]._id);
                                callback(null, token);
                            } else {
                                log('Failed to authenticate', users[0]._id);
                                callback('err', null);
                            } 
                        });
                    } else {
                        log('No user exists for username', userData.username);
                        callback('err', null);
                    }
                });
            } else {
                log('Could not find user', userData);
                callback('err', null);
            }
        });
};

/**
 * To find a user by username
 * @method userDatabase.findUserByUsername On user sign in
 * @param userData Must have unique username(phone number)
 * @return null if no user is found
 * @return userObject if any user exists
 *  */
userDatabase.prototype.findUserByUsername = function (username, callback) {
    dbUsers.collection(collectionUser).find(
        {'username' : username},
        function (err, res) {
            if (!err) {
                res.toArray(function(err, users){
                    if(users.length === 0) {
                        log('User does not exist', username);
                        callback(null, null);
                    } else {
                        log('User exists', username);
                        callback(null, res);
                    } 
                });
            } else {
                log('Error in finding user', username);
                callback('err', null);
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