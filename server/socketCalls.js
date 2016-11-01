var BASE;
players = Array();
module.exports = {
  getCalls: function(io, base){
    console.slog("Reading socketIo calls")
    BASE = base;
    io.on('connection', function(socket) {
      socket.emit('/start');
      socket.on('/playerReady' , function(){
        BASE.setPlayer(function(reply){
          console.slog(reply);
        })
      });

    });

  }
}
