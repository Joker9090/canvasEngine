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

  extraScript.callAsyncScript(["b_canvas","b_canvasObjects","b_canvasEvents"],function(){
    console.clog("Correctly Load Scripts libs");


    CC = new CanvasController(document.getElementById("canvas"))
    CC.showFps = true;

    CO = CanvasObjects()

    COM = []
    COM[0] = new CO.CanvasObjectsManager(CC.canvas);

    COM[0].MAPBYROOM[0] = COM[0].createMap("backMap");
    COM[0].MAPBYROOM[0].layer = 0;

    setInterval(function(){
      CC.objectsToDraw = COM[0].getAllObjects();
    },10)

    cloudBlock = Array();
    createCloud = function(x,y,ac){
      tempOpts = {
        name: 'nube',
         type: 'mapObject', // mapObjectNotFocused , mapObject
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
         windSpeed: ac
      }
      last = tempOpts.blockId
      cloudBlock[last] = COM[0].createObject(tempOpts);
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
            a.drawPosX(),
            a.drawPosY(),
            a.width,
            a.height
            );
          }
        }
      })
      COM[0].MAPBYROOM[0].addObject(cloudBlock[last]);
    }

    createCloudInterval = setInterval(function(){
      if((Math.floor(Math.random() * 10) + 1  ) > 7){
        createCloud(-100,(Math.floor(Math.random() * 350) + 250  ),Math.random()+ 1)
      }
    },500)

    //FloorGrass
    COM[0].MAPBYROOM[1] = COM[0].createMap("solidMap");

    COM[0].MAPBYROOM[1].setLayer(1);

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
      grassBlocks[i] = COM[0].createObject(tempOpts);

      grassBlocks[i].setImgSrc("html/public/img/textures.png",function(a){
        grassBlocks[i].draw = function(){
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
      COM[0].MAPBYROOM[1].addObject(grassBlocks[i]);

    }

    grassBlocks1 = Array()
    for (var i = 0; i < 6; i++) {
      tempOpts1 = {
        type: 'mapObject',
        name: "grass1",
        posX: (i == 0) ? 250 : (i*200)+ 250,
        posY: 490,
        width: 70,
        height: 70,
        solid: 1,
        static: 0,
        startSpriteX: 330,
        startSpriteY: 10,
        endSpriteX: 60,
        endSpriteY: 60
      }
      grassBlocks1[i] = COM[0].createObject(tempOpts1);

      grassBlocks1[i].setImgSrc("html/public/img/textures.png",function(a){
        grassBlocks1[i].draw = function(){
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
      COM[0].MAPBYROOM[1].addObject(grassBlocks1[i]);

    }
    MEOpt = {
      name:"me",
      posX: 200,
      posY: 100,
      friction:25,
      layer: 1,
      width: 20,
      height: 50,
      mass:1,
      // wind_resistence: 5,
      solid:1,
      static:0,
      // XContactFunction: function(otherObj,direction){
      //   console.log(otherObj.name+" "+direction)
      // },
      // YContactFunction: function(otherObj,direction){
      //   console.log(otherObj.name+" "+direction)
      // }
    };

    ME = COM[0].createObject(MEOpt);
    ME.draw = function(){
      CC.canvas.ctx.fillStyle = "white";
      CC.canvas.ctx.fillRect(ME.drawPosX(),ME.drawPosY(),ME.width,ME.height)
      CC.canvas.ctx.fillStyle = "black";
    }

    COM[0].setXFocus(ME);
    COM[0].setYFocus(ME);

    personOpt2 = {
      name:"person2",
      posX: 300,
      posY: 250,
      layer: 1,
      width: 200,
      height: 50,
      mass: 1,
      wind_resistence: 5,
      solid:1,
      static:0
    };

    person2 = COM[0].createObject(personOpt2);

    person2.draw = function(){
      CC.canvas.ctx.fillStyle = "white";
      CC.canvas.ctx.fillRect(person2.drawPosX(),person2.drawPosY(),person2.width,person2.height)
      CC.canvas.ctx.fillStyle = "black";
    }



    COM[0].FORCESBYROOM[0] = COM[0].startXFORCES(1);
    COM[0].FORCESBYROOM[1] = COM[0].startGravity(1);
    COM[0].FORCESBYROOM[1].setGravity(9.8)

    COM[0].FORCESBYROOM[2] = COM[0].startWind(0);
    COM[0].FORCESBYROOM[2].setWindForce(0.2);

    CE = new CanvasEvents(CC.canvas.c);

    left =  { keyCode  : 37, function : leftMove, keyReleaseFunction:leftMoveStop, delay : 20 }
    up =    { keyCode  : 38, function : jump, delay : 500, block: true }
    right = { keyCode  : 39, function : rightMove, keyReleaseFunction:rightMoveStop, delay : 20 }

    function leftMove() { ME.X_Force = (ME.X_Force > -10) ? ME.X_Force+(-1) : ME.X_Force+0 }
    function leftMoveStop(){ }

    function jump() { ME.Y_Force = 20 }

    function rightMove() { ME.X_Force = (ME.X_Force < 10) ? ME.X_Force+(1) : ME.X_Force+0 }
    function rightMoveStop(){ }

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
