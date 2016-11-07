var worldCalls = require('../world/WorldCalls.js' );
module.exports = {
  getCalls: function(io){
    console.slog("Setting socketIo calls")
    // BASE = base;
    io.on('connection', function(socket) {

      socket.on('/getInstructions',function(){
        console.slog("Sending Instructions")
        socket.emit('/sendInstructions',"showMenu");
      });
      socket.on('/joinGame',function(room){
        console.slog("Join Player to room "+room)
        worldCalls.addPlayerToRoom(socket.id,room,function(number){
          worldCalls.getStage("01",function(stage){
            console.slog("Sending roomStage "+room)
            socket.emit('/setRoomStage',stage);
          });
          worldCalls.getRoomPlayers(socket.id,function(players){
            io.emit('/setRoomPlayers',players);
          })

          worldCalls.getPlayerId(socket.id,function(number){
            io.emit('/getMyPlayer',number);
          });

        })
      });
      socket.on('/getRoomPlayers',function(){
        worldCalls.getRoomPlayers(socket.id,function(players){
          io.emit('/setRoomPlayers',players);
        })
      })

      socket.emit('/start');

      // socket.on('/jump' , function(){
      //   worldCalls.jumpPlayer(socket.id)
      // });
      //
      // socket.on('/left' , function(){
      //   worldCalls.leftPlayer(socket.id)
      // });
      //
      // socket.on('/right' , function(){
      //   worldCalls.rightPlayer(socket.id)
      // });

    });

  }
}
