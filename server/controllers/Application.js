
module.exports = {
  clientDraw: function(res){
    console.slog("Leyendo controllers.clientDraw");
    res.render('clientDraw', { test: "start debug" }, function(err, html) {  //contenido principal
        console.slog("Devolviendo vista clientDraw con layout");
        res.render('layout', { html: html }); //leyout donde poner el contenido principal, el CP esta en la variable html
    });
  },
  game: function(res){
    console.slog("Leyendo controllers.game");
    res.render('game', { test: "start debug" }, function(err, html) {  //contenido principal
        console.slog("Devolviendo vista game con layout");
        res.render('layout', { html: html }); //leyout donde poner el contenido principal, el CP esta en la variable html
    });
  },
  getMenu: function(res){
    console.slog("Leyendo controllers.getMenu");
    res.render('items/menu');
  },
  serverDraw: function(res){
    console.slog("Leyendo controllers.serverDraw");
    res.render('serverDraw', { test: "start debug" }, function(err, html) {  //contenido principal
        console.slog("Devolviendo vista serverDraw con layout");
        res.render('layout', { html: html }); //leyout donde poner el contenido principal, el CP esta en la variable html
    });
  }
};
