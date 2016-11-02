module.exports = {
  getCalls: function(io,base,world){
    console.slog("Setting socketIo calls")
    // BASE = base;
    io.on('connection', function(socket) {
      socket.emit('/start');

      // socket.on('/playerReady' , function(){
      //   console.slog("Sending Stage1")
      //   socket.emit('/setStage',BASE.global().client.stages[0]);
      //
      //   BASE.setNewPlayer(function(){
      //     socket.emit('/setPlayers',BASE.global().client.players);
      //   });
      //
      // });


    });

  }
}
