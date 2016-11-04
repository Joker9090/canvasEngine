var fs = require('fs')
var canvasObject = require("interactiveObjects");

init = function(){
  console.slog("Setting Object World")
}();

module.exports = {

  getStage: function(number,fn){
    getFile("data/stages/"+number+".json",function(obj){
      fn(obj)
    })
  },

  getPlayer: function(number,fn){
    getFile("data/players/"+number+".json",function(obj){
      fn(obj)
    })
  }
}

function getFile(path,fn){
  console.slog("Read file "+path)
  fs.readFile(path, 'utf8', function(error, data){
    if(!error) return fn(data);
    console.log(error);
  })
}
