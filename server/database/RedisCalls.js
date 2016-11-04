var redis = require('redis'); // Install Redis  http://redis.io/topics/quickstart
var client = redis.createClient("6379", "127.0.0.1");
init_redis = function(){
  console.slog("Setting Redis DataBase")
  client.set("playerID","0")
  client.set("players","[]")
}();

module.exports = {
  getPlayerID: function(fn){
    client.get("playerID",function(id){
      client.set("playerID",parseInt(id)+1)
      console.log(id)
      fn(id);
    })
  },
  signUpPlayer : function(objs,fn){
    console.slog("Adding Player")
    client.set("players", JSON.stringify(objs),function(){
      fn()
    })
  },
  getPlayers: function(fn){
    console.slog("Getting Players")
    client.get("players",function(objs){
      console.log(objs)
      fn(objs)
    });
  }
}
