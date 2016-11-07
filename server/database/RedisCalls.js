var redis = require('redis'); // Install Redis  http://redis.io/topics/quickstart
var client = redis.createClient("6379", "127.0.0.1");
init_redis = function(){
  console.slog("Setting Redis DataBase")
  client.set("playerID","0")
  client.set("players","[]")
}();

module.exports = {
  getPlayerID: function(room,fn){
    client.get("playerID",function(err, id){
      client.set("playerID",parseInt(id)+1)
      fn(id);
    })
  }
}
