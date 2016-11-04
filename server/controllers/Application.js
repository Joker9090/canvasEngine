
module.exports = {
  clientDraw: function(res){
    console.slog("Leyendo controllers.clientDraw");
    res.render('clientDraw', { test: "start debug" }, function(err, html) {  //contenido principal
        console.slog("Devolviendo vista index con layout");
        res.render('layout', { html: html }); //leyout donde poner el contenido principal, el CP esta en la variable html
    });
  },
  serverDraw: function(res){
    console.slog("Leyendo controllers.serverDraw");
    res.render('serverDraw', { test: "start debug" }, function(err, html) {  //contenido principal
        console.slog("Devolviendo vista index2 con layout");
        res.render('layout', { html: html }); //leyout donde poner el contenido principal, el CP esta en la variable html
    });
  }
};
