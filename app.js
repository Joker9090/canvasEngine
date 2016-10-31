
var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var ndp = require("npm-demo-pkg");
var ndp = require("npm-demo-pkg");

CanvasObjects = ndp.CanvasObjects()

tempOpts = {
   name: 'nube',
   type: 'mapObject',
   blockId: 1,
   posX: 200,
   posY: 300,
   width: 100,
   layer:0,
   mass: 0,
   solid: 0,
   height: 50,
   startSpriteX: 0,
   startSpriteY: 0,
   endSpriteX: 288,
   endSpriteY: 144
}
nube = CanvasObjects.createObject(tempOpts)



//Logs tunned
console.slog = function(text){ console.log("[SERVER] "+ text) }
console.clog = function(text){ console.log("[CLIENT] "+ text) }
//Logs tunned

//folders
function makeFolder(folderName){
  return __dirname + folderName
}

server = makeFolder("/server")
views = makeFolder("/html/views")
_public = makeFolder("/html/public")
//folders

//set jade
app.set('view engine', 'jade'); // set templating jade
app.set('views', views); // ruta base de las vistas
app.set('view options', { layout: false }); // layout default activado
//set jade

//socket io calls and returns
var socketCalls = require( server + '/socketCalls.js' );
//socket io calls and returns

var connections = [];

var controllers = require( server + '/controllers.js' );  // por ahora estan todos los controllers en 1
var routes = require(makeFolder('/routes.js')); // simulacion de route file
routes.set({controllers: controllers})

app.use("/html/public", express.static(path.join(_public))); // armado estatico de contenido en carpeta public

app.get('*', function(req, res){
  routes.makeRoute(req, res) // procesa el request
});

socketCalls.getCalls(io,nube);
port = 3003; // puerto para escuchar
http.listen(port, function(){
  console.slog('Escuchando en *:'+port);
});
