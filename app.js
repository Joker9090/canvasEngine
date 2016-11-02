
var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var redis = require('redis'); // Install Redis  http://redis.io/topics/quickstart
var client = redis.createClient("6379", "127.0.0.1");


var canvasObject = require("canvas-objects");


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

//Redis Calls
var redisCalls = require( server + '/redisCalls.js' );
//Redis Calls

//ObjectWorld Calls
var worldCalls = require( server + '/worldCalls.js' );
//ObjectWorld Calls

var connections = [];

var controllers = require( server + '/controllers.js' );  // por ahora estan todos los controllers en 1
var routes = require(makeFolder('/routes.js')); // simulacion de route file
routes.set({controllers: controllers})

app.use("/html/public", express.static(path.join(_public))); // armado estatico de contenido en carpeta public

app.get('*', function(req, res){
  routes.makeRoute(req, res) // procesa el request
});

CanvasObjects = canvasObject.CanvasObjects();
base = redisCalls.setRedis(client);
world = worldCalls.setWorld(CanvasObjects)

socketCalls.getCalls(io,base,world);


port = 3003; // puerto para escuchar
http.listen(port, function(){
  console.slog('Escuchando en *:'+port);
});
