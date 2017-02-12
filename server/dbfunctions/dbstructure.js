'use strict';

var async = require('async');

var dbstructure = function () {
};

var dbCollections;

dbstructure.prototype.createCollections = function (dab, callback) {
    dbCollections = dab;
    async.parallel([
        userCollection,
        tokenCollection,
        messagesCollection,
        presenceCollection
    ], function (err, success) {
        if (!err) {
            callback(null, true);
        } else {
            callback('err', null);
        }
    });
};

var userCollection = function (callback){
    dbCollections.createCollection('user', function (err, collection) {
        if (!err) {
            callback(null, collection);
            log('Successfully created collection', collection);
        } else {
            callback('err', null);
            log('Failed to create collection user');
        }
    });
};

var tokenCollection = function (callback){
    dbCollections.createCollection('token', function (err, collection) {
        if (!err) {
            callback(null, collection);
            log('Successfully created collection', collection);
        } else {
            callback('err', null);
            log('Failed to create collection token');
        }
    });
};

var messagesCollection = function (callback){
    dbCollections.createCollection('message', function (err, collection) {
        if (!err) {
            callback(null, collection);
            log('Successfully created collection', collection);
        } else {
            callback('err', null);
            log('Failed to create collection message');
        }
    });
};

var presenceCollection = function (callback){
    dbCollections.createCollection('presence', function (err, collection) {
        if (!err) {
            callback(null, collection);
            log('Successfully created collection', collection);
        } else {
            callback(err, null);
            log('Failed to create collection presence');
        }
    });
};

module.exports = dbstructure;

/**
* function for debugging usage
**/
var log = function (message, value) {
	var date = new Date();
	date = date.getHours() +  ':' + date.getMinutes() + ':'
	 + date.getSeconds() + ':' + date.getMilliseconds() + '\t';

	if (value) {
		if (typeof(value) === 'object') {
			console.log(date + '- Database server: DB structure: ' + message + ':');
			console.log(value);
		} else {
			console.log(date + '- Database server: DB structure: ' + message + ':' + value.toString());
		}
	} else {
		console.log(date + '- Database server: DB structure: ' + message);
	}
};