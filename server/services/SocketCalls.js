var worldCalls = require('../world/WorldCalls.js' );
module.exports = {
  getCalls: function(io){
    console.slog("Setting socketIo calls")
    // BASE = base;
    var connections = []
    io.on('connection', function(socket) {

      socket.on('/getInstructions',function(){
        console.slog("Sending Instructions")
        socket.emit('/sendInstructions',"showMenu");
      });

      socket.on('/joinGame',function(room){
        console.slog("Join Player to room "+room)

        worldCalls.addPlayerToRoom(socket.id,room,function(number){
          connections[connections.length] = socket.id
          worldCalls.getStage("01",function(stage){
            console.slog("Sending roomStage "+room)
            socket.emit('/setRoomStage',stage);



            worldCalls.getPlayer(socket.id,function(pos){
              socket.emit('/getMyPlayer',pos);
            });

          });

          worldCalls.getRoomPlayers(socket.id,function(players){
            socket.emit('/setRoomPlayers',players);
          })


        })

      });
      setInterval(function(){
        for (var i = 0; i < connections.length; i++) {
          worldCalls.getRoomPlayers(connections[i],function(players){
            socket.to(connections[i]).emit('/setRoomPlayers',players);
          })
        }
      },10)

      socket.emit('/start');

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
