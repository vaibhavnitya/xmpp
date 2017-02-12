'use strict';

var async = require('async');

var messageDatabase = function () {
};

var dbMessage;
var collectionMessage = 'message';

/**
 * Initites the messaging operations of the database
 * @method messageDatabase.initiate Initiates the message database operations
 * @param databaseObject
 * @return null
 *  */
messageDatabase.prototype.initiate = function (dab, callback) {
    dbMessage = dab;
};

/**
 * Saves the message into the database
 * @method messageDatabase.saveMessage It saves the message to the databse
 * @param messageData Message data should contain from, to and message
 * @return null
 *  */
messageDatabase.prototype.saveMessage = function (messageData, callback) {
    var now = (new Date()).getTime();
    dbMessage.collection(collectionMessage).insert({
        'fromuser': messageData.from,
        'touser': messageData.to,
        'message': messageData.message,
        'time': now
    }, function (err, res) {
        if(!err) {
            callback(null, true);
        } else {
            callback('err', null);
            log('Failed to save the message', messageData);
        }
    });
};

/**
 * Gets the message from the database
 * @method messageDatabase.getMessages It saves the message to the databse
 * @param filter User filters like from:userId, to:userId or time specific
 * @return Oject containing messages
 *  */
messageDatabase.prototype.getMessages = function (filterData, callback) {
    dbMessage.collection(collectionMessage).find({
        filterData
    }, function (err, res) {
        if(!err) {
            res.toArray(function (err, messages) {
                if(!err) {
                    callback(null, messages);
                } else {
                    callback('err', null);
                }
            });
        } else {
            callback('err', null);
            log('Failed to get the messages', filterData);
        }
    });
};

module.exports = messageDatabase;

/**
* function for debugging usage
**/
var log = function (message, value) {
	var date = new Date();
	date = date.getHours() +  ':' + date.getMinutes() + ':'
	 + date.getSeconds() + ':' + date.getMilliseconds() + '\t';

	if (value) {
		if (typeof(value) === 'object') {
			console.log(date + '- Database server: Message database: ' + message + ':');
			console.log(value);
		} else {
			console.log(date + '- Database server: Message database: ' + message + ':' + value.toString());
		}
	} else {
		console.log(date + '- Database server: Message database: ' + message);
	}
};