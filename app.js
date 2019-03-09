const express = require('express');
const app = express();
const socketio = require('socket.io');
const namespaces = require('./data/namespaces');

app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(9000);
const io = socketio(expressServer);

// io.on = io.of('/').on
io.on('connection', (socket) => {
    // Build an array with an image and endpoint for each namespace
    const nsData = namespaces.map(ns => {
        return {
            img: ns.img,
            endpoint: ns.endpoint
        };
    });

    // Send nsData back to the client we need to use socket not io because it should go to just this client
    socket.emit('nsList', nsData);
});

// Loop through each namespace and listen for a connection
namespaces.forEach(namespace => {
    io.of(namespace.endpoint).on('connection', (nsSocket) => {
        console.log(`${nsSocket.id} has joined ${namespace.endpoint}`);
        // A socket has connected to one of the chat group namespaces
        // Send that namespace group's info back
        nsSocket.emit('nsRoomLoad', namespace.rooms);
    });
});
