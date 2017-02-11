'use strict';

var MongoClient = require('mongodb').MongoClient;
var db;

var dbstructure = require('./dbfunctions/dbstructure.js');
var dbstruct = new dbstructure();

var userdatabase = require('./dbfunctions/userdatabase.js');
var dbuser = new userdatabase();

var messagedatabase = require('./dbfunctions/messagedatabase.js');
var dbmessage = new messagedatabase();

var database = function () {
};

var url = 'mongodb://localhost:27017/baseless';

database.prototype.initiateDatabase = function (callback) {
    MongoClient.connect(url, function(err, dab) {
        if (!err) {
            log('Connected correctly to database server', dab);
			db = dab;
			dbstruct.createCollections(db, function (err, success) {
				if (!err) {
					callback(null, success);
					dbuser.initiate(db);
					dbmessage.initiate(db);
					log('Successfully created the collections');
				} else {
					callback(err, null);
					log('Failed to create collections');
				}
			}); 
        } else {
            log('Failed to connect to the database server', err);
            callback(err, null);
        }
    });
};

module.exports = database;

/**
* function for debugging usage
**/
var log = function (message, value) {
	var date = new Date();
	date = date.getHours() +  ':' + date.getMinutes() + ':'
	 + date.getSeconds() + ':' + date.getMilliseconds() + '\t';

	if (value) {
		if (typeof(value) === 'object') {
			console.log(date + '- Database server: ' + message + ':');
			console.log(value);
		} else {
			console.log(date + '- Database server: ' + message + ':' + value.toString());
		}
	} else {
		console.log(date + '- Database server: ' + message);
	}
};

