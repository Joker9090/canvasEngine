var redis = require('redis'); // Install Redis  http://redis.io/topics/quickstart 
var client = redis.createClient("6379", "127.0.0.1");
init_redis = function(){
  console.slog("Setting Redis DataBase")
}();

module.exports = {

}
