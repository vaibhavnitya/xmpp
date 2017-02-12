'use strict';

var async = require('async');
var crypto = require('crypto');

var tokenDatabase = function () {
};

var dbToken;
var collectionToken = 'token';

/**
 * Initites the token operations of the database
 * @method tokenDatabase.initiate Initiates the token database operations
 * @param databaseObject
 * @return null
 *  */
tokenDatabase.prototype.initiate = function (dab, callback) {
    dbToken = dab;
};

/**
 * Creates the user token on creatio of the user
 * @method tokenDatabase.createToken It creates token on creation of user
 * @param userData User data should contain userId and password
 * @return Oject containing token
 *  */
tokenDatabase.prototype.createToken = function (userData, callback) {
    var newToken = crypto.randomBytes(64).toString('hex');
    var now = (new Date()).getTime();
    dbToken.collection(collectionToken).insert({
        'userid': userData.userId,
        'password': userData.password,
        'token': newToken,
        'time': now
    }, function (err, res) {
        if(!err) {
            log('Successfully generated new token for user', userData.userId);
            callback(null, res);
        } else {
            log('Failed to generate new token for user', userData.userId);
            callback('err', null);
        }
    });
};

/**
 * To get the token on providing a username and password
 * @method tokenDatabase.validateUserAndGetToken It gets the the token after validating user
 * @param userToken userId and password 
 * @return Token details of the user
 *  */
tokenDatabase.prototype.validateUserAndGetToken = function (userData, callback) {
    dbToken.collection(collectionToken).find({
        'userid': userData.userId
    }, function (err, res) {
        if(!err) {
            res.toArray(function(err, user){
                if(user[0] && userData.password === user[0].password) {
                    log('User successfully authenticated', userData.userId);
                    callback(null, res.token);
                } else {
                    log('User failed to authenticate', userData.userId);
                    callback('err', null);
                }
            });
        } else {
            log('Error in retrieving data', userData.user);
            callback('err', null);
        }
    });
};

/**
 * To get the user on providing a token
 * @method tokenDatabase.getUserFromToken It gets the user from database on providing a token
 * @param userToken User token 
 * @return Oject containing user details
 *  */
tokenDatabase.prototype.getUserFromToken = function (userToken, callback) {
    dbToken.collection(collectionToken).find({
        'token': userToken
    }, function (err, res) {
        if(!err) {
            callback(null, res);
        } else {
            log('Error in retrieving data', userToken);
            callback('err', null);
        }
    });
};

/**
 * To uodate the token
 * @method updateToken
 * @param userId User Id
 * @return Oject containing user details
 *  */
var updateToken = function (userId, callback) {
    var newToken = crypto.randomBytes(64).toString('hex');
    var now = (new Date()).getTime();
    dbToken.collection(collectionToken).update(
        {'userid' : userId},
        {$set:
            {
                'token': newToken,
                'time': now
            }
        },
        {
            upsert: false,
            multi: false
        }, function (err, res) {
            if (!err) {
                callback(null, res);
            } else {
                callback('err', null);
                log('Failed to update token', userId);
            }
        });
};

module.exports = tokenDatabase;

/**
* function for debugging usage
**/
var log = function (message, value) {
	var date = new Date();
	date = date.getHours() +  ':' + date.getMinutes() + ':'
	 + date.getSeconds() + ':' + date.getMilliseconds() + '\t';

	if (value) {
		if (typeof(value) === 'object') {
			console.log(date + '- Database server: Token database: ' + message + ':');
			console.log(value);
		} else {
			console.log(date + '- Database server: Token database: ' + message + ':' + value.toString());
		}
	} else {
		console.log(date + '- Database server: Token database: ' + message);
	}
};