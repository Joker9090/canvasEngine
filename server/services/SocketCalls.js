var worldCalls = require('../world/WorldCalls.js' );
module.exports = {
  getCalls: function(io){
    console.slog("Setting socketIo calls")
    // BASE = base;
    io.on('connection', function(socket) {
      socket.emit('/start');

      socket.on('/playerReady' , function(){
        console.clog("Sending Stage1")
        worldCalls.getStage("01",function(stage){
          socket.emit('/setStage',stage);
        })
      });
      socket.on('/addPlayer' , function(){
        worldCalls.addPlayer(function(){
          worldCalls.getPlayers(function(players){
            socket.emit('/getPlayers',players);
          })
        })
      });
    });

  }
}
