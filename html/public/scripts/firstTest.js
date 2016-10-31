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
    MAP = OBJ_MANAGER.createMap("Bosque");
    MAP.setType("image");
    MAP.setImgSrc("html/public/img/background.png")
    MAP.setPos(100,MAP.posY);
    MAP.setViewportY(200);
    MAP.setViewportX(200);

    MAP2 = OBJ_MANAGER.createMap("Bosque2");
    MAP2.setType("objects");
    MAP2.setImgSrc("html/public/img/background.png")
    cloud_options = {
      name: 'nube',
      type: 'mapObjectFocus', // mapObjectFocus , mapObject
      posX: 50,
      posY: 400,
      width: 50,
      height: 50
    }
    cloud = OBJ_MANAGER.createObject(cloud_options);
    cloud.draw = function(){

      //mapObjectFocus
      CC.canvas.ctx.fillRect(cloud.drawPosX(0.2), cloud.drawPosY(), cloud.width, cloud.height);

      //mapObject
      //CC.canvas.ctx.fillRect(cloud.drawPosX(MAP2.posX), cloud.drawPosY(MAP2.posY), cloud.width, cloud.height);
    }

    MAP2.addObject(cloud)
    MAP2.setViewportY(200);
    MAP2.setViewportX(200);

    // setInterval(function(){
    //   MAP3.setPos(MAP3.posX+2,MAP3.posY)
    // },400)

    CC.objectsToDraw = OBJ_MANAGER.getAllObjects;

    o_god_options = {
      name: 'god',
      layer: 1
    }

    o_god = OBJ_MANAGER.createObject(o_god_options);
    OBJ_MANAGER.setFocus(o_god);

    o_person_options = {
      name: 'person',
      width: 50,
      height: 100,
      posX: 200,
      posY: 0,
      layer: 1
    }

    o_person = OBJ_MANAGER.createObject(o_person_options);
    o_person.draw = function(){
        CC.canvas.ctx.fillRect(o_person.drawPosX(), o_person.drawPosY(), o_person.width, o_person.height);
    }

    o_black_person_options = {
      name: 'BlackPerson',
      width: 150,
      height: 80,
      posX: 100,
      posY: 0,
      layer: 0
    }

    o_black_person = OBJ_MANAGER.createObject(o_black_person_options);
    o_black_person.draw = function(){
        CC.canvas.ctx.fillStyle = "white";
        CC.canvas.ctx.fillRect(o_black_person.drawPosX(), o_black_person.drawPosY(), o_black_person.width, o_black_person.height);
        CC.canvas.ctx.fillStyle = "black";
    }

    CE = new CanvasEvents(document.getElementById("canvas"));

    left =  { keyCode  : 37, function : leftMove, delay : 20 }
    right = { keyCode  : 39, function : rightMove, delay : 20 }

    function leftMove() {
      o_god.setPos(o_god.posX - 1,o_god.posY);
      MAP.setPos(MAP.posX-0.3,MAP.posY);
    }

    function rightMove() {
      o_god.setPos(o_god.posX + 1,o_god.posY);
      MAP.setPos(MAP.posX+0.3,MAP.posY);
    }

    CE.addKeyEvent(left);
    CE.addKeyEvent(right);


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
