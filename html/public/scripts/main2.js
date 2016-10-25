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

    MAP = OBJ_MANAGER.createMap("backMap");
    MAP.setType("objects");
    MAP.setViewportY(200);
    MAP.setViewportX(200);
    MAP.setPos(50,50);
    MAP.layer = 0;

    cloudBlock = Array();
    createCloud = function(x,y,ac){
      tempOpts = {
        name: 'nube',
         type: 'mapObject', // mapObjectFocus , mapObject
         posX: x,
         posY: y,
         width: 100,
         height: 50,
         startSpriteX: 0,
         startSpriteY: 0,
         endSpriteX: 288,
         endSpriteY: 144,
         windSpeed: ac
      }
      last = cloudBlock.length
      cloudBlock[last] = OBJ_MANAGER.createObject(tempOpts);
      cloudBlock[last].setImgSrc("html/public/img/cloud.png",function(a){
        cloudBlock[last].draw = function(){
          CC.canvas.ctx.drawImage(
          a.img,
          a.startSpriteX,
          a.startSpriteY,
          a.endSpriteX,
          a.endSpriteY,
          a.drawPosX(MAP.posX),
          a.drawPosY(MAP.posY),
          a.width,
          a.height
          );
        }
      })
      MAP.addObject(cloudBlock[last]);
    }


    createCloudInterval = setInterval(function(){
      if((Math.floor(Math.random() * 10) + 1  ) > 7){
        createCloud(-100,(Math.floor(Math.random() * 350) + 250  ),Math.random()+ 1)
      }
    },500)
    //FloorGrass
    grassBlocks = Array();
    for (var i = 0; i < 18; i++) {
      tempOpts = {
        type: 'mapObject',
        posX: (i == 0) ? 0 : (i*100),
        posY: 50,
        width: 100,
        height: 100,
        startSpriteX: 206,
        startSpriteY: 10,
        endSpriteX: 60,
        endSpriteY: 50
      }
      grassBlocks[i] = OBJ_MANAGER.createObject(tempOpts);
      grassBlocks[i].setImgSrc("html/public/img/textures.png",function(a){
        grassBlocks[i].draw = function(){
          CC.canvas.ctx.drawImage(
            a.img,
            a.startSpriteX,
            a.startSpriteY,
            a.endSpriteX,
            a.endSpriteY,
            a.drawPosX(MAP.posX),
            a.drawPosY(MAP.posY),
            a.width,
            a.height
          );
        }
      })
      MAP.addObject(grassBlocks[i]);
    }


      WIND = OBJ_MANAGER.startWind(2)
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
