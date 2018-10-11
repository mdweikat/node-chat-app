var socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
  console.log(`${message.from} : ${message.text}`);
});


var sendLocationBtn = jQuery('#send-location');
sendLocationBtn.click( function() {
  if (!navigator.geolocation) {
    return alert('Geoloaction not support by your browser.');
  }

  navigator.geolocation.getCurrentPosition(function(postion) {
    console.log(postion);
    socket.emit('createLocationMessage', {
      lat: postion.coords.latitude,
      lng: postion.coords.longitude
    })

  }, function() {
  alert('Unable to fetch location.');

  });

});
