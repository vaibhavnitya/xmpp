'use strict';

$(document).ready(function () {
var client;
var host = 'localhost';
var name, receiverName;
$('#signin').click(function () {
    name = ($('#uname')[0]).value;
    var passcode = document.getElementById('password').value;
    if (name && passcode) {
        client = new XMPP.Client({
            jid: name + '@' + host,
            password: passcode,
            websocket: {
                url: 'ws://' + host + ':' + '7777'
            },
            autoStart: true
        });
    } else {
        document.getElementById('loginError').innerHTML = 'Username and password cannot be empty';
    }

    client.on('online', function () {
        console.log('client: Client is connected to the server');
        ($('#userLogin')[0]).style.display = 'none';
        ($('#message')[0]).style.display = 'block';
    });

    client.on('stanza', function (stanza) {
        console.log('client: Received stanza: ' + stanza.toString());
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(stanza,"text/xml");
        var message = xmlDoc.getElementsByTagName('message')[0];
        if (message.getAttribute('type') === 'chat') {
            var to = message.getAttribute('to');
            var from = message.getAttribute('from');
            var messageText = message.getAttribute('message');
            var time = new Date(parseInt(message.getAttribute('time')));
            ($('#allMessages')[0]).innerHTML += '<br>' + 'From:' + from + '<br>' + 'To: ' +
            to + '<br>' + 'Time: ' + time + '<br>' + messageText +'<br>';
        } else if (message.getAttribute('type') === 'history') {
            console.log(stanza);
            displayMessages(message.getAttribute('messages'));
        }
    });
});

$('#toSignup').click(function () {
    document.getElementById('userLogin').style.display = 'none';
    document.getElementById('userRegistration').style.display = 'block';
});

$('#backtoLogin').click(function () {
    document.getElementById('userLogin').style.display = 'block';
    document.getElementById('userRegistration').style.display = 'none';
});

$('#startChat').click(function () {
    var now = (new Date()).getTime();
    receiverName =  document.getElementById('receiverName').value;
    if (receiverName) {
        userStartsChat();
        var message = new XMPP.Client.Stanza('message', {
            to: receiverName,
            from: name,
            type: 'getHistory',
            time: now
        });
        client.send(message);
    }
});

$('#changeChat').click(function () {
    userChangesChat();
});

$('#textSend').click(function () {
    sendMessage();
});

var sendMessage = function () {
    var text = ($('#messageText')[0]).value;
    if (text.length && text.length < 250) {
        var now = new Date();
        var timeStamp = now.getTime();
        var msgData = {'fromuser': name, 'touser': receiverName, 'time': timeStamp, 'message': text};
        var message = new XMPP.Client.Stanza('message', {
            to: receiverName,
            from: name,
            type: 'chat',
            time: timeStamp,
            message: text
        });
        displayMessageToUI(msgData);
        client.send(message);
        document.getElementById('messageText').value = null;
    }
};

// when user clicks register
$('#register').click(function () {
    var username = document.getElementById('username').value,
        firstname = document.getElementById('fname').value,
        lastname = document.getElementById('lname').value,
        fpassword = document.getElementById('fpassword').value,
        rpassword = document.getElementById('rpassword').value;
    if (username && firstname && lastname && fpassword && rpassword) {
        if (fpassword === rpassword) {
            $.ajax({
                type: "POST",
                url: '/registerUser',
                dataType: "json",
                data: {
                    'username': username,
                    'fname': firstname,
                    'lname': lastname,
                    'password': fpassword
                },
                success: function (err, res) {
                    document.getElementById('userLogin').style.display = 'block';
                    document.getElementById('userRegistration').style.display = 'none';
                    document.getElementById('registrationError').innerHTML='Successfully registered user';
                    console.log('Success');
                },
                error: function () {
                    document.getElementById('registrationError').innerHTML='Failed to register user';
                    console.log('Failed');
                }
            });
        } else {
            document.getElementById('rpassword').value = 'Passwords dont match';
        }
    } else {
        document.getElementById('registrationError').innerHTML='Fields missing data';
    }
});

var displayMessages = function (msgs) {
    var messages = JSON.parse(msgs);
    for (var i = 0; i < messages.length; i++) {
        displayMessageToUI(messages[i]);
    }
};

var displayMessageToUI = function (message) {
    var date = new Date(message.time);
    var displayDate = date.getHours() + ':' + date.getMinutes() + ', ';
    displayDate += date.getDay() + '/' + date.getMonth() + '/' + date.getFullYear();
    if(message.fromuser === name) {
        document.getElementById('allMessages').innerHTML += '<div class="from-message">' +
        '<div class="from-message-text">' + message.message +'</div>'+
        '<div class="message-time">' + displayDate + '</div>'+ 
        '<div>';
    } else {
        document.getElementById('allMessages').innerHTML += '<div class="to-message">' +
        '<div class="to-message-text">' + message.message +'</div>'+
        '<div class="message-time">' + displayDate + '</div>'+ 
        '<div>';
    }
};

var userStartsChat = function () {
    document.getElementById('receiverName').disabled = true;
    document.getElementById('changeChat').style.display = 'inline';
    document.getElementById('startChat').style.display = 'none';
    document.getElementById('userArea').style.display = 'block';
    document.getElementById('messageText').value = null;
    setTimeout(function () {
        document.getElementById('allMessages').scrollTop = document.getElementById('allMessages').scrollHeight;
    }, 1000);
}

var userChangesChat = function () {
    document.getElementById('receiverName').disabled = false;
    document.getElementById('changeChat').style.display = 'none';
    document.getElementById('startChat').style.display = 'inline';
    document.getElementById('userArea').style.display = 'none';
    document.getElementById('receiverName').value = null;
    document.getElementById('allMessages').innerHTML = '';
}

$('#quit').click(function () {
    userChangesChat();
    ($('#userLogin')[0]).style.display = 'block';
    ($('#message')[0]).style.display = 'none';
    client.end();
    name = null;
    client = null;
});
});