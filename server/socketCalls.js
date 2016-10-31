
module.exports = {
  getCalls: function(io,nube){
    console.slog("Reading socketIo calls")

    io.on('connection', function(socket) {
      // console.log(socket)
      socket.emit('/start');
      socket.on('/getNube' , function(){
        socket.emit('/sendNube',nube);
      });

    });

  }
}
