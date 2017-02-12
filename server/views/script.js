'use strict';

var client;
var host = 'localhost';
var name;

$('#nameSubmit').click(function () {
    name = ($('#name')[0]).value;
    client = new XMPP.Client({
        jid: name + '@' + host,
        password: 'ssdfsdf',
        websocket: {
            url: 'ws://localhost' + ':' + '7777'
        },
        autoStart: true
    });

    client.on('online', function () {
        console.log('client: Client is connected to the server');
        ($('#open')[0]).style.display = 'none';
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

$('#quit').click(function () {
    ($('#open')[0]).style.display = 'block';
    ($('#message')[0]).style.display = 'none';
    client.end();
    name = null;
    client = null;
});