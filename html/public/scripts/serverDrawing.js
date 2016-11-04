uris = {
  "b_logs"   : "/html/public/scripts/libs/b_logs/b_logs.js",
  "b_canvas" : "/html/public/scripts/libs/b_canvas/b_canvas.js",
  "b_canvasObjects" : "/html/public/scripts/libs/b_canvas/b_canvasObjects.js",
  "b_canvasEvents"  : "/html/public/scripts/libs/b_canvas/b_canvasEvents.js",
};

extraScript.setUrls(uris);
extraScript.callScript("b_logs",start);

function start(){
  //handleResizeFunctions
  window.doInResizeFunctions = [];
  window.onresize = function(){
    function _doInResizeFunctions(fs){
      for (var i = 0; i < fs.length; i++) { fs[i](); }
    }
    if(doInResizeFunctions.length > 0) _doInResizeFunctions(doInResizeFunctions);
  };
  doInResizeFunctions[doInResizeFunctions.length] = makeContentGoodAgain
  makeContentGoodAgain();
  var socket = io();
  socket.on('/start', function(){
    console.slog("Socket io On");
  });

  extraScript.callAsyncScript(["b_canvas","b_canvasObjects","b_canvasEvents"],function(){
    console.clog("Correctly Load Scripts libs");

    CC = new CanvasController(document.getElementById("canvas"))
    CC.showFps = true;

    OBJ_MANAGER = new CanvasObjects(CC.canvas);
    CC.objectsToDraw = OBJ_MANAGER.getAllObjects;
    window.GLOBAL = {};

    socket.emit('/playerReady');
    console.clog("START")
    socket.on('/setStage',function(obj){
      console.clog("STAGE READY")
      window.GLOBAL.stage = JSON.parse(obj);
      drawSTAGE()
      socket.emit('/addPlayer');
    });
    socket.on('/getPlayers',function(objs){
      console.log(objs)
      window.GLOBAL.players = JSON.parse(objs);
      drawPlayers()
    });


    function drawSTAGE(){

      MAP = OBJ_MANAGER.createMap("solidBlocksLayer");
      MAP.setLayer(1);
      MAP.setType("objects");

      for (var i = 0; i < window.GLOBAL.stage.staticBlocks.length; i++) {
        window.GLOBAL.stage.staticBlocks[i] = OBJ_MANAGER.createObject(window.GLOBAL.stage.staticBlocks[i]);

        window.GLOBAL.stage.staticBlocks[i].setImgSrc(window.GLOBAL.stage.staticBlocks[i].spriteFile,function(a){
          window.GLOBAL.stage.staticBlocks[i].draw = function(){
            CC.canvas.ctx.drawImage(
              a.img,
              a.startSpriteX,
              a.startSpriteY,
              a.endSpriteX,
              a.endSpriteY,
              a.drawPosX(),
              a.drawPosY(),
              a.width,
              a.height
            );
          }
        })
        MAP.addObject(window.GLOBAL.stage.staticBlocks[i]);
      }
    }

    function drawPlayers(){
      for (var i = 0; i < window.GLOBAL.players.length; i++) {
        window.GLOBAL.players[i] = OBJ_MANAGER.createObject(window.GLOBAL.players[i]);
        console.log(window.GLOBAL.players[i])
        window.GLOBAL.players[i].draw = function(){
          CC.canvas.ctx.fillStyle = "white";
          CC.canvas.ctx.fillRect(this.drawPosX(),this.drawPosY(),this.width,this.height)
          CC.canvas.ctx.fillStyle = "black";
        }
      }
    }

  });

}

function makeContentGoodAgain() {
  footer = document.getElementById("footer");
  ctn = document.getElementById("content");
  header = document.getElementById("header");
  newCtnHeight = window.innerHeight - (footer.offsetHeight+header.offsetHeight)
  ctn.setAttribute("style","height:"+newCtnHeight+"px");
  if(ctn.offsetHeight+header.offsetHeight > window.innerHeight) {
    footer.setAttribute("class","")
  }else{ footer.setAttribute("class","pushedBot") }
}
