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

        nsSocket.on('joinRoom', (roomToJoin, numOfUsersCallback) => {
            // Deal with chat history once we have it
            nsSocket.join(roomToJoin);
            io.of('/wiki').in(roomToJoin).clients((err, clients) => {
                numOfUsersCallback(clients.length);
            });
        });

        nsSocket.on('newMessageToServer', (msg) => {
            const fullMsg = {
                text: msg.text,
                time: Date.now(),
                username: 'Dave',
                avatar: 'https://via.placeholder.com/30'
            };
            console.log('fullMsg', fullMsg);
            // Send this message to all the sockets that are in the room that this socket is in
            console.log(nsSocket.rooms);
            // The user will be in the second room in the object list
            // This is because the socket ALWAYS joins its own room first upon connection
            // Get rooms keys
            const roomTitle = Object.keys(nsSocket.rooms)[1];
            io.of('/wiki').to(roomTitle).emit('messageToClients', fullMsg);
        });
    });
});
