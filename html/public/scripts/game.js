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

  OBJ_MANAGER = new CanvasObjects(CC.canvas);
  CC.objectsToDraw = getAllObjects;
  window.GLOBAL = {};
  window.GLOBAL.players = [];
  window.GLOBAL.stage = [];
  LOADER.load("Armando mundo",true)
}

function joinGame(room){
  document.getElementById("menu").remove();
  socket.emit("/joinGame",room)

  LOADER.setItemsToLoad(["Armando mundo","Armando escenario","Sincronizando jugadores"])
  LOADER.make();

  setWorld();


  LOADER.load("Armando escenario",true)
  socket.on("/setRoomStage",function(stage){
    window.GLOBAL.stage = JSON.parse(stage);
    drawSTAGE();
    setInterval(function(){
      socket.emit('/getRoomPlayers');
    },10)
  })

  LOADER.load("Sincronizando jugadores",true)
  socket.on("/setRoomPlayers",function(players){
    window.GLOBAL.players = players;
    drawPlayers();
  })

  socket.on('/getMyPlayer',function(n){
    console.log(n)
    ME = n;
  });


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
          OBJ_MANAGER.drawPosX(this),
          OBJ_MANAGER.drawPosY(this),
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
        OBJ_MANAGER.drawPosX(this),
        OBJ_MANAGER.drawPosY(this),
        this.width,
        this.height
      )
      CC.canvas.ctx.fillStyle = "black";
    }
  }

  if(typeof ME != "undefined"){
    console.log(window.GLOBAL.players[ME])
    OBJ_MANAGER.setGlobalXFocus(window.GLOBAL.players[ME],getAllObjects())
  }

}
