
module.exports = {
  getCalls: function(io){
    console.slog("Reading socketIo calls")

    io.on('connection', function(socket) {
      // console.log(socket)
      socket.emit('/start');
    });

  }
}
