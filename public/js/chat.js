var socket = io();

function scrollToBottom() {

  var messages = jQuery("#messages");
  var lastMessage = messages.children('li:last-child');

  var scrollHeight = messages.prop('scrollHeight');
  var scrollTop = messages.prop('scrollTop');
  var clientHeight = messages.prop('clientHeight');
  var lastMessageHeight = lastMessage.innerHeight();
  var prevLastMessageHeight = lastMessage.prev().innerHeight();

  if ( clientHeight + scrollTop + lastMessageHeight + prevLastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
    console.log('Should Scroll.');
  }
}

socket.on('connect', function () {
  var params = jQuery.deparam(window.location.search);

  socket.emit('join', params, function(err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    }

    console.log('No error');
  });

});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
  var formatedTime = moment(message.createdAt).format('h:mm a');
  var li = jQuery('<li class="message"></li>');
  li.html(`<div class="message__title"> <h4>${message.from}</h4> <span>${formatedTime}</span> </div> <div class="message__body"> <p>${message.text}</p> </div>`);

  jQuery('#messages').append(li);

  scrollToBottom();
});

socket.on('newLocationMessage', function (message) {
  var li = jQuery('<li class="message"></li>');
  var a = jQuery('<a target="_blank">My current location</a>');
  var p = jQuery('<p></p>');

  li.html(`<div class="message__title"> <h4>${message.from}</h4></div> <div class="message__body">`);
  a.attr('href', message.url);
  p.append(a);
  li.append(p);
  li.append(`</div>`);

  jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();

  var messageTextbox = jQuery('[name=message]');

  socket.emit('createMessage', {
    from: 'User',
    text: messageTextbox.val()
  }, function () {
    messageTextbox.val('')
  });
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }

  locationButton.attr('disabled', 'disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    locationButton.removeAttr('disabled').text('Send location');
    alert('Unable to fetch location.');
  });
});
