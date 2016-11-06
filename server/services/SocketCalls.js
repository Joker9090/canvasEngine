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
          worldCalls.getPlayers(function(players){
            io.emit('/getPlayers',players);
          })
        })

      });



      setInterval(function(){
        worldCalls.getPlayers(function(players){
          io.emit('/getPlayers',players);
        })
      },10)

      socket.on('/addPlayer' , function(){
        worldCalls.addPlayer(socket.id,function(number){
          socket.emit('/getMyPlayer',number);
        })
      });

      socket.on('/jump' , function(){
        worldCalls.jumpPlayer(socket.id)
      });

      socket.on('/left' , function(){
        worldCalls.leftPlayer(socket.id)
      });

      socket.on('/right' , function(){
        worldCalls.rightPlayer(socket.id)
      });
    });

  }
}
