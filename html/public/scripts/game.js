console.clog("All Js Loaded")

LOADER = loader();
LOADER.setItemsToLoad(["Esperando instrucciones"])
LOADER.make();

var socket = io();
socket.emit('/getInstructions')
socket.on('/sendInstructions', function(instruction){
  window[instruction]()
  LOADER.load("Esperando instrucciones",true);
});

function showMenu(){
  var menu = ajax('/getMenu', 'get',  function(obj) {
    document.getElementById("content").innerHTML = document.getElementById("content").innerHTML + obj.responseText
  })
}

function setWorld(){



  CC = new CanvasController(document.getElementById("canvas"))
  CC.showFps = true;

  CO = CanvasObjects()
  COM = []
  COM[0] = new CO.CanvasObjectsManager(CC.canvas);

  CC.objectsToDraw = getAllObjects;
  window.GLOBAL = {};
  window.GLOBAL.players = [];
  window.GLOBAL.stage = [];
}

function joinGame(room){
  document.getElementById("menu").remove();
  socket.emit("/joinGame",room)

  setWorld();

  socket.on("/setRoomStage",function(stage){
    console.clog("Stage Builded")
    window.GLOBAL.stage = JSON.parse(stage);
    drawSTAGE();
  })

  socket.on("/setRoomPlayers",function(players){
    window.GLOBAL.players = players;
    drawPlayers();
  })

  socket.on('/getMyPlayer',function(n){
    console.clog("Get My Player")
    ME = n;
  });

  CE = new CanvasEvents(CC.canvas.c);

  up =    { keyCode  : 38, function : jump, delay : 500, block: true }
  function jump() { socket.emit('/jump'); }
  CE.addKeyEvent(up);

  left =  { keyCode  : 37, function : leftMove, delay : 20 }
  up =    { keyCode  : 38, function : jump, delay : 500, block: true }
  right = { keyCode  : 39, function : rightMove, delay : 20 }

  function leftMove() { socket.emit('/left'); }

  function jump() { socket.emit('/jump'); }

  function rightMove() { socket.emit('/right');}

  CE.addKeyEvent(left);
  CE.addKeyEvent(right);
  CE.addKeyEvent(up);

}




function getAllObjects(){
  objs = [];
  if(typeof window.GLOBAL.stage.staticBlocks != "undefined") {
    if(window.GLOBAL.stage.staticBlocks instanceof Array) objs =  objs.concat(window.GLOBAL.stage.staticBlocks)
  }
  if(typeof window.GLOBAL.players != "undefined") {
    if(window.GLOBAL.players instanceof Array) objs =  objs.concat(window.GLOBAL.players)
  }
  return objs;
}

function loadImg(obj, fn){
  obj.img = new Image();
  obj.img.onload = function(obj){
    fn(obj);
  }(obj)
  obj.img.src = obj.spriteFile;
}

function drawSTAGE(){
  for (var i = 0; i < window.GLOBAL.stage.staticBlocks.length; i++) {
    loadImg(window.GLOBAL.stage.staticBlocks[i],function(a){
      window.GLOBAL.stage.staticBlocks[i].draw = function(){
        CC.canvas.ctx.drawImage(
          this.img,
          this.startSpriteX,
          this.startSpriteY,
          this.endSpriteX,
          this.endSpriteY,
          COM[0].drawPosX(this),
          COM[0].drawPosY(this),
          this.width,
          this.height
        );
      }
    })
  }
}

function drawPlayers(){
  for (var i = 0; i < window.GLOBAL.players.length; i++) {
    window.GLOBAL.players[i].draw = function(){
      CC.canvas.ctx.fillStyle = "white";
      CC.canvas.ctx.fillRect(
        COM[0].drawPosX(this),
        COM[0].drawPosY(this),
        this.width,
        this.height
      )
      CC.canvas.ctx.fillStyle = "black";
    }
  }
  if(typeof ME != "undefined" && typeof window.GLOBAL.players[ME] != "undefined"){
    COM[0].setXFocus(window.GLOBAL.players[ME]);
    // COM[0].setYFocus(window.GLOBAL.players[ME]);
    COM[0].setGlobalXFocus(window.GLOBAL.players[ME],getAllObjects())
  }

}
