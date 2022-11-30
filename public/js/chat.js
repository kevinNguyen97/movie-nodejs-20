console.log('chat.js');

const socket = io('/', {
  auth: {
    token: '',
    userName: 'name',
  },
});

document.getElementById('form-messages').addEventListener('submit', (event) => {
  console.log(socket.id);

  event.preventDefault();

  const message = document.getElementById('input-messages').value;

  socket.emit('send-message-to-room', message, (errors) => {
    if (errors) {
      return alert(errors);
    }
  });

  document.getElementById('input-messages').value = '';
});

socket.on('receive-message-on-room', (data) => {
  console.log({ messageReceive: data });

  const element = `<div class="message-item">
  <div class="message__row1">
    <p class="message__name">${data.user.username}</p>
    <p class="message__date">${data.time}</p>
  </div>
  <div class="message__row2">
    <p class="message__content">
    ${data.message}
    </p>
  </div>
</div>`;

  document.getElementById('message-list').innerHTML += element;
});

socket.on('refresh-user', (arrUser) => {
  if (Array.isArray(arrUser)) {
    const html = arrUser.map(({ username }) => `<li class="app__item-user">${username}</li>`).join(' ');
    document.getElementById('user-list-by-room').innerHTML = html;
  }
});

// get query string
const queryString = location.search;

const info = Qs.parse(queryString, {
  ignoreQueryPrefix: true,
});

socket.emit('join-room', info);

// share location

document.getElementById('btn-share-location').addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Browser not support');
  }

  navigator.geolocation.getCurrentPosition(({ coords: { longitude, latitude } }) => {
    const location = {
      longitude,
      latitude,
    };

    socket.emit('share-location', location);
  });
});

// handle event receive location sharing
socket.on('receive-location-sharing', (data) => {
  console.log({ messageReceive: data });

  const element = `<div class="message-item">
  <div class="message__row1">
    <p class="message__name">${data.user.username}</p>
    <p class="message__date">${data.time}</p>
  </div>
  <div class="message__row2">
    <p class="message__content">
      <a href="${data.message}" target="_blank">${data.user.username}</a>
    </p>
  </div>
</div>`;

  document.getElementById('message-list').innerHTML += element;
});

socket.on('history-message', (data) => {
  const locationElem = () => {
    return `<a href="${data.message}" target="_blank">${data.user.username}</a>`;
  };

  document.getElementById('message-list').innerHTML = data
    .map((ele) => {
      return `<div class="message-item">
    <div class="message__row1">
      <p class="message__name">${ele.user.username}</p>
      <p class="message__date">${ele.time}</p>
    </div>
    <div class="message__row2">
      <p class="message__content">
        ${ele.type === 'text' ? ele.message : locationElem(ele)}
      </p>
    </div>
  </div>`;
    })
    .join('');
});
