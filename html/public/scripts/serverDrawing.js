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
    CC.objectsToDraw = getAllObjects;
    window.GLOBAL = {};
    window.GLOBAL.players = [];
    window.GLOBAL.stage = [];
    socket.emit('/playerReady');
    console.clog("START")

    socket.on('/getMyPlayer',function(n){
      ME = n;
    });

    socket.on('/setStage',function(obj){
      console.clog("STAGE READY")
      window.GLOBAL.stage = JSON.parse(obj);
      drawSTAGE();
      socket.emit('/addPlayer');
    });
    socket.on('/getPlayers',function(objs){
      window.GLOBAL.players = objs;
      drawPlayers();
    });

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
        OBJ_MANAGER.setGlobalXFocus(window.GLOBAL.players[ME],getAllObjects())

      }

      // console.log(OBJ_MANAGER.focusedObject)
    }


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
