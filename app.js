var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


//Logs tunned
console.slog = function(text){ console.log("[SERVER] "+ text) }
console.clog = function(text){ console.log("[CLIENT] "+ text) }
//Logs tunned

//folders
function makeFolder(folderName){
  return __dirname + folderName
}

controllers = makeFolder("/server/controllers/")
services = makeFolder("/server/services/")
views = makeFolder("/html/views")
_public = makeFolder("/html/public")
//folders

//set pug
app.set('view engine', 'pug'); // set templating pug
app.set('views', views); // ruta base de las vistas
app.set('view options', { layout: false }); // layout default activado
//set pug

//Services
var socketCalls = require( services + 'SocketCalls.js' );
//Services

//Controllers
var Application = require( controllers + 'Application.js' );
//Controllers

var connections = [];

var routes = require(makeFolder('/routes.js')); // simulacion de route file
routes.set(Application)

app.use("/html/public", express.static(path.join(_public))); // armado estatico de contenido en carpeta public

app.get('*', function(req, res){
  routes.makeRoute(req, res) // procesa el request
});

socketCalls.getCalls(io);

port = 3003; // puerto para escuchar
http.listen(port, function(){
  console.slog('Escuchando en *:'+port);
});
