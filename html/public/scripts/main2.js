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
    MAP.layer = 0;


    cloudBlock = Array();
    createCloud = function(x,y,ac){
      tempOpts = {
        name: 'nube',
         type: 'mapObject', // mapObjectFocus , mapObject
         blockId: cloudBlock.length,
         posX: x,
         posY: y,
         width: 100,
         layer:0,
         mass: 0,
         solid: 0,
         height: 50,
         startSpriteX: 0,
         startSpriteY: 0,
         endSpriteX: 288,
         endSpriteY: 144,
         windSpeed: ac,
         remove: function(){
           OBJ_MANAGER.getObjectById(this.id).canDraw = 0
         }
      }
      last = tempOpts.blockId
      cloudBlock[last] = OBJ_MANAGER.createObject(tempOpts);
      cloudBlock[last].setImgSrc("html/public/img/cloud.png",function(a){
        cloudBlock[last].draw = function(){
          if(a.posX > CC.width) a.remove()
          if(a.canDraw == 1){
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

    MAP2 = OBJ_MANAGER.createMap("solidMap");
    MAP2.setLayer(1);
    MAP2.setType("objects");
    MAP2.setViewportY(200);
    MAP2.setViewportX(200);

    grassBlocks = Array();
    for (var i = 0; i < 18; i++) {
      tempOpts = {
        type: 'mapObject',
        name: "grass",
        posX: (i == 0) ? 0 : (i*50),
        posY: 50,
        width: 50,
        solid: 1,
        static: 1,
        height: 50,
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
            a.drawPosX(MAP2.posX),
            a.drawPosY(MAP2.posY),
            a.width,
            a.height
          );
        }
      })
      MAP2.addObject(grassBlocks[i]);

    }



    MEOpt = {
      name:"me",
      posX: 200,
      posY: 150,
      layer: 1,
      width: 20,
      height: 50,
      mass:1,
      // wind_resistence: 1,
      solid:1,
      static:0
    };

    ME = OBJ_MANAGER.createObject(MEOpt);
    ME.draw = function(){
      CC.canvas.ctx.fillStyle = "white";
      CC.canvas.ctx.fillRect(ME.drawPosX(),ME.drawPosY(),ME.width,ME.height)
      CC.canvas.ctx.fillStyle = "black";
    }
    OBJ_MANAGER.setFocus(ME);
    OBJ_MANAGER.gameType = "platform";

    personOpt2 = {
      name:"person2",
      posX: 300,
      posY: 250,
      layer: 1,
      width: 20,
      height: 50,
      // wind_resistence: 1,
      solid:1,
      static:0
    };

    person2 = OBJ_MANAGER.createObject(personOpt2);
    person2.draw = function(){
      CC.canvas.ctx.fillStyle = "white";
      CC.canvas.ctx.fillRect(person2.drawPosX(),person2.drawPosY(),person2.width,person2.height)
      CC.canvas.ctx.fillStyle = "black";
    }


    WIND1 = OBJ_MANAGER.startWind(0);
    WIND1.setWindForce(0.1);

    OBJ_MANAGER.startXFORCES(1);

    GRAVITY2 = OBJ_MANAGER.startGravity(1);
    GRAVITY2.setGravity(9.8)



    CE = new CanvasEvents(CC.canvas.c);

    left =  { keyCode  : 37, function : leftMove, keyReleaseFunction:leftMoveStop, delay : 20 }
    up =    { keyCode  : 38, function : jump, delay : 500, block: true }
    right = { keyCode  : 39, function : rightMove, keyReleaseFunction:rightMoveStop, delay : 20 }

    function leftMove() { ME.X_Force = (ME.X_Force > -5) ? ME.X_Force+(-0.5) : ME.X_Force+0 }
    function leftMoveStop(){ ME.X_Force = 0; }

    function jump() { ME.Y_Force = 15 }

    function rightMove() { ME.X_Force = (ME.X_Force < 5) ? ME.X_Force+(0.5) : ME.X_Force+0 }
    function rightMoveStop(){ ME.X_Force = 0; }

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
