var fs = require('fs')
var redisCalls = require('../database/RedisCalls.js' );
var canvasObject = require("interactiveObjects");
init = function(){
  console.slog("Setting Object World")
  CO = canvasObject.CanvasObjects();
  MAP = CO.createMap("backMap");
  MAP.layer = 0;
  getFile("data/stages/01.json",function(obj){
    obj = JSON.parse(obj)
    for (var i = 0; i < obj.staticBlocks.length; i++) {
      obj.staticBlocks[i] = CO.createObject(obj.staticBlocks[i])
      MAP.addObject(obj.staticBlocks[i]);
    }
  });

  CO.startXFORCES(0);
  GRAVITY = CO.startGravity(0);
  GRAVITY.setGravity(9.8)
  PLAYERS = {};
  PLAYERS.client = [];
  PLAYERS.server = [];
}();

module.exports = {

  getStage: function(number,fn){
    getFile("data/stages/"+number+".json",function(obj){
      fn(obj)
    })
  },

  addPlayer: function(fn){
    redisCalls.getPlayerID(function(id){
      player = {
        name: 'Player-'+id,
        playerId:id,
        posX: 0,
        posY: 500,
        width: 50,
        solid: 1,
        static: 1,
        height: 50
      }
      PLAYERS.client[PLAYERS.client.length] = player
      redisCalls.signUpPlayer(player,function(){
        PLAYERS.server[PLAYERS.server.length] = CO.createObject(player);
        fn()
      })
    })
  },

  getPlayers: function(fn){
    redisCalls.getPlayers(function(objs){
      fn(objs);
    });
  }
}

function getFile(path,fn){
  console.slog("Read file "+path)
  fs.readFile(path, 'utf8', function(error, data){
    if(!error) return fn(data);
    console.log(error);
  })
}
