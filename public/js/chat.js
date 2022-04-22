console.log('chat.js');

const socket = io('/', {
  auth: {
    token: '',
    userName: 'name',
  },
});

document.getElementById('form-messages').addEventListener('submit', (event) => {
console.log(socket.id)

  event.preventDefault();

  const message = document.getElementById('input-messages').value;

  socket.emit('send-message', message, (errors) => {
    if (errors) {
      return alert(errors);
    }
  });
});

socket.on('receive-message', (message) => {
  console.log({ messageReceive: message });
});


socket.on('refresh-user', (arrUser, myId) => {
  if (Array.isArray(arrUser)) {
    const html = arrUser.map((ele) => `<li class="app__item-user">${ele}</li>`).join(' ');
    document.getElementById('user-list-by-room').innerHTML = html;
  }
});


