function joinNs(endpoint) {
    // Close previous nsSocket connection if there was one
    if (nsSocket) {
        // Check to see if nsScoket is actually a socket
        nsSocket.close();
        // Remove the event listener before its added again
        document.querySelector('#user-input').removeEventListener('submit', formSubmission);
    }

    nsSocket = io(`http://localhost:9000${endpoint}`);

    nsSocket.on('nsRoomLoad', (nsRooms) => {
        let roomList = document.querySelector('.room-list');
        roomList.innerHTML = '';
        nsRooms.forEach(room => {
            const glyph = room.privateRoom ? 'glyphicon-lock' : 'glyphicon-globe';
            roomList.innerHTML += `<li class="room"><span class="glyphicon ${glyph}"></span>${room.roomTitle}</li>`;
        });

        // Add click listener to each room
        let roomNodes = document.getElementsByClassName('room');
        Array.from(roomNodes).forEach(elem => {
            elem.addEventListener('click', (event) => {
                // console.log(`someone clicked on ${event.target.innerText}`);
                joinRoom(event.target.innerText);
            });
        });

        // Automatically add user to a default room
        const defaultRoom = document.querySelector('.room');
        const defaultRoomName = defaultRoom.innerText;

        joinRoom(defaultRoomName);

    });

    nsSocket.on('messageToClients', (msg) => {
        const newMsgHTML = buildHTML(msg);
        console.log(msg);
        document.querySelector('#messages').innerHTML += newMsgHTML;
    });

    document.querySelector('.message-form').addEventListener('submit', formSubmission);
}

function formSubmission(event) {
    event.preventDefault();
    const newMessage = document.querySelector('#user-message').value;
    nsSocket.emit('newMessageToServer', {text: newMessage});
}

function buildHTML(msg) {
    const convertedDate = new Date(msg.time).toLocaleString();
    return `
    <li>
        <div class="user-image">
            <img src="${msg.avatar}" />
        </div>
        <div class="user-message">
            <div class="user-name-time">${msg.username} <span>${convertedDate}</span></div>
            <div class="message-text">${msg.text}</div>
        </div>
    </li>`;
}
