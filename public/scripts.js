const socket = io('http://localhost:9000');
let nsSocket;

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
            joinNs(nsEndpoint);
        });
    });

    joinNs(nsData[0].endpoint);
});
