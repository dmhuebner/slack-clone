function joinRoom(roomName) {
    // Send this roomName to the server
    nsSocket.emit('joinRoom', roomName, (newNumberOfMembers) => {
        // We want to update the room member total now that we have acknowledgement of join
        document.querySelector('.curr-room-num-users').innerHTML = `${newNumberOfMembers} <span class="glyphicon glyphicon-user"></span>`;
    });
}
