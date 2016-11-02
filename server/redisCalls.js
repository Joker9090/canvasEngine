var CLIENT = "";

module.exports = {
  setRedis: function(client){
    console.slog("Setting Redis DataBase")
    CLIENT = client;
  }
}
