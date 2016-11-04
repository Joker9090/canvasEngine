var worldCalls = require('../world/WorldCalls.js' );
var redisCalls = require('../database/RedisCalls.js' );

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

        console.clog("Sending Player1")
        worldCalls.getPlayer("01",function(playerData){
          socket.emit('/setPlayer',playerData);
        })
      });


    });

  }
}
