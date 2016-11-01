var BASE;
players = Array();
module.exports = {
  getCalls: function(io, base){
    console.slog("Reading socketIo calls")
    BASE = base;
    io.on('connection', function(socket) {
      // console.log(socket)
      socket.emit('/start');
      socket.on('/playerReady' , function(){
        // BASE.start();
        BASE.setPlayer(function(reply){
          console.slog(reply);
        })
      });

    });

  }
}
