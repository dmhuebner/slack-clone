function joinRoom(roomName) {
    // Send this roomName to the server
    nsSocket.emit('joinRoom', roomName, (newNumberOfMembers) => {
        // We want to update the room member total now that we have acknowledgement of join
        document.querySelector('.curr-room-num-users').innerHTML = `${newNumberOfMembers} <span class="glyphicon glyphicon-user"></span>`;
    });

    nsSocket.on('historyCatchUp', (chatHistory) => {
        console.log('chatHistory', chatHistory);
        const messagesUl = document.querySelector('#messages');
        messagesUl.innerHTML = ``;
        chatHistory.forEach(msg => {
            const newMessage = buildHTML(msg);
            const currentMessages = messagesUl.innerHTML;
            messagesUl.innerHTML = currentMessages + newMessage;
        });

        messagesUl.scrollTo(0, messagesUl.scrollHeight);
    });

    nsSocket.on('updateMembers', (numMembers) => {
        document.querySelector('.curr-room-num-users').innerHTML = `${numMembers} <span class="glyphicon glyphicon-user"></span>`;
        document.querySelector('.curr-room-text').innerText = `${roomName}`;
    });
}
