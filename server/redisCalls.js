var CLIENT = "";

function getPlayers(fn){
  CLIENT.get('players', function(err, reply) {
    if(reply == null) {
      CLIENT.set('players',1);
      getPlayers(fn)
    }else{ CLIENT.set('players',parseInt(reply)+1); fn(reply) }
  });
}

module.exports = {
  getCalls: function(client){
    console.slog("Reading Redis calls")
    CLIENT = client;
    obj = {};
    obj.setPlayer = function(fn){  getPlayers(function(reply){ fn(reply) }) }
    return obj;
  }
}


// CLIENT.hmset('frameworks', 'javascript', 'AngularJS', 'css', 'Bootstrap', 'node', 'Express');
// CLIENT.hgetall('frameworks', function(err, object) {
//     console.log(object);
// });
