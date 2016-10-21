var controllers;
module.exports = {
  set: function(o){
    controllers = o.controllers; // seteo del objeto controller
  },
  makeRoute: function(req, res){
    console.log(req)
    console.slog("Armando ruta " + req.method + " " + req.originalUrl)
    switch (req.originalUrl) {
      case "/":
      switch (req.method) {
        case "GET": controllers.getIndex(res);
        break;
        case "POST":

        break;
        default:
      }
      break;

      default:
      console.slog("No encontro " + req.originalUrl )
      res.status(404).send('Not found');
    }

  }
};
