var CLIENT = "";
var CANVASOBJECTS = "";
var GLOBAL = {};

module.exports = {
  getCalls: function(client,canvasObjects){
    console.slog("Reading Redis calls")
    CANVASOBJECTS = canvasObjects;
    CLIENT = client;
    CLIENT.flushdb();

    setGame()
    obj = {};
    obj.setNewStage = createStage;
    obj.setNewPlayer = createPlayer

    obj.global = getGlobal;
    return obj;
  }
}

function getGlobal(){
 return GLOBAL
}

function setGame(){
                                              //make STAGE 1
  CLIENT.set('players',0);

  GLOBAL.client = {}
  GLOBAL.client.stages = Array();
  GLOBAL.client.players = Array();

  GLOBAL.server = {}
  GLOBAL.server.stages = Array();
  GLOBAL.server.players = Array();

}

function createStage(){
  console.slog("***[START MAKING STAGE 1]***")
  console.slog("Making STAGE 1 floor")
  stage1 = {}
  stage1.staticBlocks = Array();
  for (var i = 0; i < 40; i++) {
    tempOpts = {
      type: 'mapObject',
      name: "grass",
      posX: (i == 0) ? 0 : (i*50),
      posY: 50,
      width: 50,
      height: 50,
      spriteFile: "html/public/img/textures.png",
      startSpriteX: 206,
      startSpriteY: 10,
      endSpriteX: 60,
      endSpriteY: 50
    }
    stage1.staticBlocks[stage1.staticBlocks.length] = tempOpts;
  }

  console.slog("***[END MAKING STAGE 1]***")

  GLOBAL.client.stages[0] = stage1;
  GLOBAL.server.stages[0] = stage1;

}
function createPlayer(){
  console.slog("***[ADD NEW PLAYER]***")
  p_obj = {}
  p_obj.server = {
    name:"me",
    posX: 200,
    posY: 100,
    friction:25,
    layer: 1,
    width: 20,
    height: 50,
    mass:1,
    solid:1,
    static:0
  }

  p_obj.server = CANVASOBJECTS.createObject(p_obj.server);

  p_obj.server.playerNumber = CLIENT.get('players');

  p_obj.client = {
    name:"me",
    posX: 200,
    posY: 100,
    layer: 1,
    width: 20,
    height: 50
  }
  GLOBAL.client.players[GLOBAL.client.players.length] = p_obj.client;
  GLOBAL.server.players[GLOBAL.server.players.length] = p_obj.server;

  CLIENT.set('players',parseInt(p_obj.server.playerNumber)+1);
}


// CLIENT.hmset('frameworks', 'javascript', 'AngularJS', 'css', 'Bootstrap', 'node', 'Express');
// CLIENT.hgetall('frameworks', function(err, object) {
//     console.log(object);
// });
