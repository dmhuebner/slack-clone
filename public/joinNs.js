function joinNs(endpoint) {
    const nsSocket = io(`http://localhost:9000${endpoint}`);
    console.log(`http://localhost:9000${endpoint}`);
    nsSocket.on('nsRoomLoad', (nsRooms) => {
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

    nsSocket.on('messageToClients', (msg) => {
        console.log(msg);
        document.querySelector('#messages').innerHTML += `<li>${msg.text}</li>`;
    });

    document.querySelector('.message-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const newMessage = document.querySelector('#user-message').value;
        socket.emit('newMessageToServer', {text: newMessage})
    });
}
