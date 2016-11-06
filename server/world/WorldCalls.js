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

  forces = []
  forces[0] = {
    type:"xforce",
    layer:0
  }
  forces[1] = {
    type:"gravity",
    layer:0,
    force:9.8
  }

  CO.startXFORCES(0);
  GRAVITY = CO.startGravity(0);
  GRAVITY.setGravity(9.8)
  PLAYERS = [];
}();


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

  getStage: function(number,fn){
    getFile("data/stages/"+number+".json",function(obj){
      fn(obj)
    })
  },

  addPlayer: function(socketId,fn){
    redisCalls.getPlayerID(function(id){
      player = {
        name: 'Player-'+id,
        playerId:id,
        socketId:socketId,
        posX: 0,
        layer:0,
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
        focusPosY: 0,
        YContactFunction: function(otherObj,direction){
          if(otherObj.name.indexOf("Player") > -1){
            if(direction == 'down') {
              otherObj.posX = 0
              otherObj.posY = 500
            }
          }
        }
      }
      PLAYERS[PLAYERS.length] = CO.createObject(player);
      fn(id)
    })
  },

  getPlayers: function(fn){
    fn(prepareObjectsToSend(PLAYERS))
  },

  jumpPlayer: function(socketId){
    getPlayerBySocket(socketId).Y_Force = 20
  },

  leftPlayer: function(socketId){
    getPlayerBySocket(socketId).X_Force = (getPlayerBySocket(socketId).X_Force > -10) ? getPlayerBySocket(socketId).X_Force+(-1) : getPlayerBySocket(socketId).X_Force+0
  },

  rightPlayer: function(socketId){
    getPlayerBySocket(socketId).X_Force = (getPlayerBySocket(socketId).X_Force < 10) ? getPlayerBySocket(socketId).X_Force+(1) : getPlayerBySocket(socketId).X_Force+0
  },
}

function getPlayerBySocket(socketId){
    for (var i = 0; i < PLAYERS.length; i++) {
      if(PLAYERS[i].socketId == socketId) return PLAYERS[i];
    }
}

function getFile(path,fn){
  console.slog("Read file "+path)
  fs.readFile(path, 'utf8', function(error, data){
    if(!error) return fn(data);
    console.log(error);
  })
}
