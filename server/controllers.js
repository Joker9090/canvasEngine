
module.exports = {
  getIndex: function(res){
    console.slog("Leyendo controllers.index");
    res.render('index', { test: "start debug" }, function(err, html) {  //contenido principal
        console.slog("Devolviendo vista index con layout");
        res.render('layout', { html: html }); //leyout donde poner el contenido principal, el CP esta en la variable html
    });
  },
  getIndex2: function(res){
    console.slog("Leyendo controllers.index2");
    res.render('index2', { test: "start debug" }, function(err, html) {  //contenido principal
        console.slog("Devolviendo vista index2 con layout");
        res.render('layout', { html: html }); //leyout donde poner el contenido principal, el CP esta en la variable html
    });
  }
};
