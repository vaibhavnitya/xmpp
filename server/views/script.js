'use strict';

$(document).ready(function () {
var client;
var host = 'localhost';
var name;
$('#signin').click(function () {
    name = ($('#uname')[0]).value;
    var passcode = document.getElementById('password').value;
    if (name && passcode) {
        client = new XMPP.Client({
            jid: name + '@' + host,
            password: passcode,
            websocket: {
                url: 'ws://localhost' + ':' + '7777'
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
        var to = message.getAttribute('to');
        var from = message.getAttribute('from');
        var messageText = message.getAttribute('message');
        ($('#allMessages')[0]).innerHTML += '<br>' + 'From:' + from + '<br>' + messageText +'<br>';
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

$('#textSend').click(function () {
    var text = ($('#messageText')[0]).value;
    var dest = ($('#receiverName')[0]).value;
    var message = new XMPP.Client.Stanza('message', {
        to: dest,
        from: name,
        type: 'chat',
        message: text
    });
    client.send(message);
});

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

$('#quit').click(function () {
    ($('#userLogin')[0]).style.display = 'block';
    ($('#message')[0]).style.display = 'none';
    client.end();
    name = null;
    client = null;
});
});