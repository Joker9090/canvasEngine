
module.exports = {
  getIndex: function(res){
    console.slog("Leyendo controllers.index");
    res.render('index', { test: "start debug" }, function(err, html) {  //contenido principal
        console.slog("Devolviendo vista index con layout");
        res.render('layout', { html: html }); //leyout donde poner el contenido principal, el CP esta en la variable html
    });
  }
};
