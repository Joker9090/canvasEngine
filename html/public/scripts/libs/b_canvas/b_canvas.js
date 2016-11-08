CanvasController = function(e){
  cc_self = this;
  cc_self.getCanvas = function(e){
    canvas = {}
    canvas.c = e;
    canvas.ctx = canvas.c.getContext("2d");
    canvas.c.width = 800;  // default
    canvas.c.height = 600; // default
    return canvas
  };
  cc_self.setWidth = function(w){ cc_self.canvas.c.width = w; }
  cc_self.setHeight = function(h){ cc_self.canvas.c.height = h; }

  cc_self.objectsToDraw = function(){ return [] };
  cc_self.canvas = cc_self.getCanvas(e);
  cc_self.showFps = false;

  cc_self.draw = function(){
    // cc_self.objects
    objects = (typeof cc_self.objectsToDraw === "function" ) ? cc_self.objectsToDraw() : cc_self.objectsToDraw ;
    cc_self.canvas.ctx.fillRect(0,0,cc_self.canvas.c.width,cc_self.canvas.c.height);

    for (var i = 0; i < objects.length; i++) {

      if(typeof objects[i].draw == "function" ) objects[i].draw()
      if(typeof objects[i].draw == "function" ) objects[i].draw()
    }
    if(cc_self.showFps) cc_self.showFpsFunction();
    requestAnimationFrame(cc_self.draw);
  }
  requestAnimationFrame(cc_self.draw);

  cc_self.showFpsFunction = function(){
    this.lastCalledTime;
    this.fps;
    if(document.getElementById("showFps") == null){
      _p = document.createElement("P");
      _p.setAttribute("id","showFps");
      _p.setAttribute("style","position:absolute;top: 15px; right: 5px; z-index:9999;color:white;");
      document.getElementsByTagName("body")[0].appendChild(_p);
    }
    this.requestAnimFrame = function() {
      if(!this.lastCalledTime) {
         this.lastCalledTime = Date.now();
         this.fps = 0;
         return;
      }
      this.delta = (Date.now() - this.lastCalledTime)/1000;
      this.lastCalledTime = Date.now();
      this.fps = 1/ this.delta;
      return Math.round(this.fps)
    }
      document.getElementById("showFps").innerHTML = this.requestAnimFrame() + " FPS"
  };



};
