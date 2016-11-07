var fs = require('fs')
var redisCalls = require('../database/RedisCalls.js' );
var canvasObject = require("interactiveObjects");
init = function(){
  // CO = canvasObject.CanvasObjects();
  CO = [];
  CO[0] = new canvasObject.CanvasObjects();
  CO[1] = new canvasObject.CanvasObjects();
  PLAYERSBYROOM = [];
  PLAYERSBYROOM[0] = [];
  PLAYERSBYROOM[1] = [];
  MAPBYROOM = [];
  MAPBYROOM[0] = [];
  MAPBYROOM[1] = [];
  FORCESBYROOM = [];
  FORCESBYROOM[0] = [];
  FORCESBYROOM[1] = [];
}();
function startGameInRoom(room){
  console.slog("Setting Object World for Room "+room)
  MAPBYROOM[room] = CO[room].createMap("backMap");
  getFile("data/stages/01.json",function(obj){
    obj = JSON.parse(obj)
    for (var i = 0; i < obj.staticBlocks.length; i++) {
      obj.staticBlocks[i] = CO[room].createObject(obj.staticBlocks[i])
      MAPBYROOM[room].addObject(obj.staticBlocks[i]);
    }

    console.slog("Setting Gravity in room "+room)
    FORCESBYROOM[room][0] = CO[room].startGravity(0);
    FORCESBYROOM[room][0].setGravity(9.8)

    console.slog("Setting xForces in room "+room)
    FORCESBYROOM[room][0] = CO[room].startXFORCES(0);

  });
}
startGameInRoom(0)
startGameInRoom(1)
function prepareObjectsToSend(objs){
  makeobject = function(o){
    newObject = {
      name: o.name,
      playerId: o.playerId,
      type:o.type,
      posX: o.posX,
      posY: o.posY,
      layer: o.layer,
      width: o.width,
      height: o.height,
      solid: o.solid,
      static: o.static,
      spriteFile: o.spriteFile,
      startSpriteX: o.startSpriteX,
      startSpriteY: o.startSpriteY,
      endSpriteX: o.endSpriteX,
      endSpriteY: o.endSpriteY,
      loadImg: o.loadImg,
      setImgSrc: o.setImgSrc,
      focus_x: o.focus_x,
      focus_y: o.focus_y,
      focusPosX: o.focusPosX,
      focusPosY: o.focusPosY,
      startPosX: o.startPosX,
      startPosY: o.startPosY
    }
    return newObject;
  }
  if(objs instanceof Array){
    arrayOfObjects = [];
    for (var i = 0; i < objs.length; i++) {
      arrayOfObjects[i] = makeobject(objs[i])
    }
    return arrayOfObjects
  }else{
    return makeobject(objs)
  }
}

module.exports = {
  addPlayerToRoom: function(socketId,room,fn){

    redisCalls.getPlayerID(room,function(id){
      player = {
        name: 'Player-'+id,
        playerId:id,
        socketId:socketId,
        posX: 0,
        layer:0,
        room:room,
        mass:1,
        friction:25,
        posY: 500,
        width: 50,
        solid: 1,
        static: 0,
        height: 50,
        startPosX: 400,
        startPosY: 0,
        focusPosX: 0,
        focusPosY: 0
        }
      PLAYERSBYROOM[room][PLAYERSBYROOM[room].length] = CO[room].createObject(player);
      console.slog("Add Player "+id+" to room "+room);
      fn(id)
    })
  },

  getStage: function(number,fn){
    getFile("data/stages/"+number+".json",function(obj){
      fn(obj)
    })
  },

  getRoomPlayers: function(socketId,fn){
    getPlayerBySocket(socketId,function(obj,pos){
      fn(prepareObjectsToSend( PLAYERSBYROOM[obj.room] ))
    })
  },


  getPlayer: function(socketId,fn){
    getPlayerBySocket(socketId,function(obj,pos){
      fn(pos);
    })
  },

  jumpPlayer: function(socketId){
    getPlayerBySocket(socketId,function(obj){
      obj.Y_Force = 20;
    });
  },

  leftPlayer: function(socketId){
    getPlayerBySocket(socketId,function(obj){
      obj.X_Force = (obj.X_Force > -10) ? obj.X_Force+(-1) : obj.X_Force+0
    });
  },

  rightPlayer: function(socketId){
    getPlayerBySocket(socketId,function(obj){
      obj.X_Force = (obj.X_Force < 10) ? obj.X_Force+(1) : obj.X_Force+0
    })
  }
}

function getPlayerBySocket(socketId,fn){
  for (var i = 0; i < PLAYERSBYROOM.length; i++) {
    for (var k = 0; k < PLAYERSBYROOM[i].length; k++) {
      if(PLAYERSBYROOM[i][k].socketId == socketId){
        fn(PLAYERSBYROOM[i][k],k);
        return true;
      }
    }
  }
  return false;
}

function getFile(path,fn){
  console.slog("Read file "+path)
  fs.readFile(path, 'utf8', function(error, data){
    if(!error) return fn(data);
    console.log(error);
  })
}
