var BASE;
players = Array();
module.exports = {
  getCalls: function(io, base){
    console.slog("Reading socketIo calls")
    BASE = base;
    io.on('connection', function(socket) {
      socket.emit('/start');
      socket.on('/playerReady' , function(){

        console.slog("Sending Stage1")
        console.slog(BASE.global())
        BASE.setNewStage();
        socket.emit('/setStage',BASE.global().client.stages[0]);

        BASE.setNewPlayer();
        socket.emit('/setPlayers',BASE.global().client.players);

      });

    });

  }
}
