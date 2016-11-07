var Application;
module.exports = {
  set: function(o){
    Application = o;
  },
  makeRoute: function(req, res){
    // console.log(req)
    console.slog("Armando ruta " + req.method + " " + req.originalUrl)
    switch (req.originalUrl) {
      case "/":
        switch (req.method) {
          case "GET": Application.clientDraw(res);
          break;
          case "POST":

          break;
          default:
        }
      break;
      case "/game":
        switch (req.method) {
          case "GET": Application.game(res);
          break;
          case "POST":

          break;
          default:
        }
      break;
      case "/getMenu":
        switch (req.method) {
          case "GET": Application.getMenu(res);
          break;
          case "POST":

          break;
          default:
        }
      break;
      case "/serverDraw":
        switch (req.method) {
          case "GET": Application.serverDraw(res);
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
