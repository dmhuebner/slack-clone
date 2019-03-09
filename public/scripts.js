const socket = io('http://localhost:9000');

console.log(socket.io);

socket.on('connect', () => {
    console.log(socket.id)
});

// Listen for nsList which is a list of all the namespaces
socket.on('nsList', (nsData) => {
    console.log('The list of namespaces has arrived', nsData);
    let namespacesDiv = document.querySelector('.namespaces');
    namespacesDiv.innerHTML = '';
    nsData.forEach(namespace => {
        namespacesDiv.innerHTML += `<div class="namespace" ns="${namespace.endpoint}"><img src="${namespace.img}" alt="namespace-image" /></div>`;
    });

    // Add a click listener for each namespace
    Array.from(document.getElementsByClassName('namespace')).forEach(element => {
        element.addEventListener('click', (event) => {
            const nsEndpoint = element.getAttribute('ns');
            console.log('nsEndpoint', nsEndpoint);
        });
    });

    const nsSocket = io('http://localhost:9000/wiki');
    console.log('http://localhost:9000/wiki');
    nsSocket.on('nsRoomLoad', (nsRooms) => {
        console.log('nsRooms', nsRooms);
        let roomList = document.querySelector('.room-list');
        roomList.innerHTML = '';
        nsRooms.forEach(room => {
            const glyph = room.privateRoom ? 'glyphicon-lock' : 'glyphicon-globe';
            roomList.innerHTML += `<li class="room"><span class="glyphicon ${glyph}"></span>${room.roomTitle}</li>`;
        });

        // Add a listener to each room
        let roomNodes = document.getElementsByClassName('room');
        Array.from(roomNodes).forEach(elem => {
            elem.addEventListener('click', (event) => {
                console.log(`someone clicked on ${event.target.innerText}`);
            });
        });
    });
});

socket.on('messageFromServer', (dataFromServer) => {
    console.log(dataFromServer);
    socket.emit('dataToServer', {data: "Data from the Client!"})
});

document.querySelector('#message-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const newMessage = document.querySelector('#user-message').value;
    socket.emit('newMessageToServer', {text: newMessage})
});

socket.on('messageToClients', (msg) => {
    console.log(msg);
    document.querySelector('#messages').innerHTML += `<li>${msg.text}</li>`;
});
