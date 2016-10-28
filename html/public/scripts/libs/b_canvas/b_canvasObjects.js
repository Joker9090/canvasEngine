CanvasObjects = function(canvas){
  co_self = this;
  co_self._mapsimageTotals = -1
  co_self.canvas = canvas;
  co_self.imgs = Array();

  co_self.objectsByLayer = Array();

  co_self.focusEnabled = false;
  co_self.focusedObject = {};
  co_self.getAllObjects = function(){
    newObjectList = Array();
    for (var i = 0; i < co_self.objectsByLayer.length; i++) {
      newObjectList = newObjectList.concat(co_self.objectsByLayer[i])
    }
    return newObjectList;
   }

  co_self.createMap = function(name){
    co_self._mapsimageTotals++;
    cm_obj = {
      id : co_self._mapsimageTotals,
      type : "map",
      layer: 0,
      setLayer: function(v){
        if(typeof co_self.objectsByLayer[v] == "undefined") co_self.objectsByLayer[v] = Array();
        co_self.objectsByLayer[v][co_self.objectsByLayer[v].length] = this;
        co_self.removeFromLayers(this.layer,this.id);
        this.layer = v;
      },
      velocityX:0,
      Y_Force:0,
      X_Force:0,
      wind_resistence:0,
      mass:0,
      getMasa: function(){
        return this.mass;
      },
      extraForce:0,
      extraForceAngle:0,
      windSpeed:0,
      solid:0,
      static: 1,
      canRemove: 0,
      remove: "",
      name : (typeof name == undefined ) ? "map" : name,
      visible : true,
      width : co_self.canvas.c.width,
      height : co_self.canvas.c.height,
      posX : 0,
      focusPosX : 0,
      setPos: function(x,y){
        this.posX = x;
        this.posY = y;
      },
      setPosX : function(x){
        if(co_self.checkHorizontalColision(this,x)){
          this.posX = x;
          return true
        }
        return false
      },
      calculePosX : function() { return this.posX; },
      posY : 0,
      focusPosY : 0,
      setPosY : function(y){
        if(co_self.checkVerticalColision(this,y)){
          this.posY = y;
          return true;
        }
        return false
      },
      calculePosY : function(){ if(this.mapType == "image") return  this.img.height - this.viewportY - this.posY ; },
      viewportX : this.width,
      setViewportX : function(val){ this.viewportX = val; },
      viewportY : this.height,
      setViewportY : function(val){ this.viewportY = val; },
      mapType: "",
      type: "", // image , blocks , multi
      makeDrawFunction : function(type){
        switch (type) {
          case "image":
            return this.drawWithImage;
          break;
          case "objects":
            return this.drawWithObjects;
          break;
        }
      },
      setType : function(type){ this.mapType = type; this.draw = this.makeDrawFunction(type); },
      mapObjects: [],
      addObject: function(obj){
        if(obj instanceof Array){
          for (var i = 0; i < obj.length; i++) {
            this.mapObjects[this.mapObjects.length] = obj[i];
            if(obj[i].layer != this.layer) obj[i].setLayer(this.layer)

          }
        }else{
          this.mapObjects[this.mapObjects.length] = obj;
          if(obj.layer != this.layer) obj.setLayer(this.layer)
        }
      },
      img: "",
      imgSrc: "",
      loadImg : function(fn){
        co_self.imgs[this.id] = new Image();
        co_self.imgs[this.id].onload = function(id){
          co_self.getObjectById(id).img = co_self.imgs[id];
          if(typeof fn == "function") fn(co_self.getObjectById(id));
        }(this.id)
        co_self.imgs[this.id].src = this.imgSrc;
      },
      setImgSrc : function(imgUrl,fn){ this.imgSrc = imgUrl; this.loadImg(fn); },
      drawWithImage : function(){
        if(this.img instanceof HTMLImageElement){
          co_self.canvas.ctx.drawImage(
          this.img,
          this.calculePosX(),
          this.calculePosY(),
          this.viewportX,
          this.viewportY,
          0,
          0,
          this.width,
          this.height
          );
        }
      },
      drawWithObjects : function(){
        //no hace falta nada porque lo dibuja el canvas como objeto
      }
    };
    cm_obj = (typeof name == "object") ? co_self.mergeObjects(name,cm_obj) : cm_obj;
    if(typeof co_self.objectsByLayer[cm_obj.layer] == "undefined"){
      co_self.objectsByLayer[cm_obj.layer] = Array();
    }
    co_self.objectsByLayer[cm_obj.layer][co_self.objectsByLayer[cm_obj.layer].length] = cm_obj;

    return cm_obj;
  }

  co_self.getObjectById = function(id){
    o = co_self.getAllObjects();
    for (var i = 0; i < o.length; i++) {
      if((o[i] != undefined ) && o[i].id == id) return o[i]
    }

  }

  co_self.fixHeightInvert = function(y,h){
    return co_self.canvas.c.height - y
    // return co_self.canvas.c.height - y - h
  };

  co_self.createObject = function(type){
    co_self._mapsimageTotals++;
    _object = {
      setPos: function(x,y){
        this.posX = x;
        this.posY = y;
      },
      setPosX : function(x){
        if(this.static == 1) return false;
        if(co_self.checkHorizontalColision(this,x)){
          this.posX = x;
          return true
        }
        return false;
      },
      setPosY : function(y){
        if(this.static == 1) return false;
        if(co_self.checkVerticalColision(this,y)){
          this.posY = y;
          return true;
        }
        return false
      },
      name: "",
      canDraw: 1,
      focus: false,
      weight: 0,
      velocityX:0,
      Y_Force:0,
      X_Force:0,
      wind_resistence:0,
      mass:0,
      getMasa: function(){
        return this.mass;
      },
      extraForce:0,
      extraForceAngle:0,
      windSpeed:0,
      solid:1,
      static: 0,
      canRemove: 0,
      remove: "",
      id: co_self._mapsimageTotals,
      img: "",
      imgSrc: "",
      setImgSrc : function(imgUrl,fn){ this.imgSrc = imgUrl; this.loadImg(fn); },
      layer: 0,
      loadImg : function(fn){
        co_self.imgs[this.id] = new Image();
        co_self.imgs[this.id].onload = function(id){
          co_self.getObjectById(id).img = co_self.imgs[id];
          if(typeof fn == "function") fn(co_self.getObjectById(id));
        }(this.id)
        co_self.imgs[this.id].src = this.imgSrc;
      },
      setLayer: function(v){
        if(typeof co_self.objectsByLayer[v] == "undefined") co_self.objectsByLayer[v] = Array();
        co_self.objectsByLayer[v][co_self.objectsByLayer[v].length] = this;
        co_self.removeFromLayers(this.layer,this.id);
        this.layer = v;
      },
      sprite: "",
      events: "",
      startPosX: 0,
      startPosY: 0,
      posX: 0,
      posY: 0,
      drawPosX: function(mapX){
        if(this.type == "mapObject") return this.posX - mapX
        if(this.type == "mapObjectFocus"){
          mapX = (typeof mapX == "undefined") ? 1 : mapX
          return (co_self.focusEnabled ) ? (this.posX - co_self.focusedObject.posX + co_self.focusedObject.startPosX)*mapX : (this.posX)*mapX;

        }
        return (co_self.focusEnabled ) ? this.posX - co_self.focusedObject.posX + co_self.focusedObject.startPosX : this.posX;
      },
      drawPosY: function(mapY){
        if(this.type == "mapObject") return co_self.fixHeightInvert(this.posY - mapY,this.height)
        if(this.type == "mapObjectFocus") {
          mapY = (typeof mapY == "undefined") ? 1 : mapY
           return (co_self.focusEnabled) ? co_self.fixHeightInvert(this.posY - co_self.focusedObject.posY + co_self.focusedObject.startPosY,this.height)*mapY :  co_self.fixHeightInvert(this.posY,this.height)*mapY;
        }
        return (co_self.focusEnabled) ? co_self.fixHeightInvert(this.posY - co_self.focusedObject.posY + co_self.focusedObject.startPosY,this.height) :  co_self.fixHeightInvert(this.posY,this.height);
      },
      focusPosX: 0,
      focusPosY: 0,
      width: 0,
      height: 0,
      startSpriteX: 0,
      startSpriteY: 0,
      endSpriteX: 0,
      endSpriteY: 0
    }

    _object = (typeof type == "object") ? co_self.mergeObjects(type,_object) : _object;

    if(typeof co_self.objectsByLayer[_object.layer] == "undefined"){
      co_self.objectsByLayer[_object.layer] = Array();
    }
    co_self.objectsByLayer[_object.layer][co_self.objectsByLayer[_object.layer].length] = _object;


    _object.startPosX = _object.posX
    _object.startPosY = _object.posY
    return _object;
  }

  co_self.mergeObjects = function(a,b){
    var c = {};
    for (var attrname in b) { c[attrname] = b[attrname]; }
    for (var attrname in a) { c[attrname] = a[attrname]; }
    return c;
  }

  co_self.removeFromLayers = function(l,id){
    for (var i = 0; i < co_self.objectsByLayer[l].length; i++) {
      if(co_self.objectsByLayer[l][i].id == id) co_self.objectsByLayer[l] = co_self.objectsByLayer[l].slice(i,1);
    }

  }

  co_self.setFocus = function(obj){
    o = co_self.getAllObjects()
    co_self.focusEnabled = true;
    for (var i = 0; i < o.length; i++) {
      if((o[i].id == obj.id)){
        o[i].focus = true;
        co_self.focusedObject = obj;
        o[i].focusPosX = o[i].posX;
        o[i].focusPosY = o[i].posY
      }else{
        o[i].focus = false;
      }
    }
  }


  co_self.checkVerticalColision = function(Obj,y){
    if(Obj.solid == 0) return true;
    if(co_self.objectsByLayer[Obj.layer].length < 2) return true
    V_objs = co_self.objectsByLayer[Obj.layer];
    canMove = true;
    for (var i = 0; i < V_objs.length; i++) {
      if((V_objs[i].id != Obj.id) && V_objs[i].solid > 0){
        if(co_self.checkPos(V_objs[i],Obj,Obj.posX,y) == false) {
            Obj.posY = (Obj.posY > y) ? V_objs[i].posY+V_objs[i].height : V_objs[i].posY-V_objs[i].height
            Obj.Y_Force = 0;


          canMove = false;
        }
      }
    }
    return canMove
  }

  co_self.checkHorizontalColision = function(Obj,x){
    if(Obj.solid == 0) return true;
    if(co_self.objectsByLayer[Obj.layer].length < 2) return true
    H_objs = co_self.objectsByLayer[Obj.layer];
    canMove = true;
    for (var i = 0; i < H_objs.length; i++) {
      if((H_objs[i].id != Obj.id) && H_objs[i].solid > 0){
        if(co_self.checkPos(H_objs[i],Obj,x,Obj.posY) == false) {
          Obj.posX = (Obj.posX > x) ? H_objs[i].posX+H_objs[i].width : H_objs[i].posX-H_objs[i].width
          Obj.X_Force = 0;
          canMove = false;
        }
      }
    }
    return canMove
  }




  co_self.checkPos = function(obj2,obj1,x,y){
    if (
      (obj2.posX+obj2.width > x) &&
      (obj2.posX < x+obj1.width) &&
      (obj2.posY < y+obj1.height) &&
      (obj2.posY+obj2.height > y)
      )
    {
      return false
    }
  };


  co_self.windsForcesIds = -1;
  co_self.windsForces = Array();
  co_self.windsForcesInterval = Array();
  co_self.startWind = function(l){
    co_self.windsForcesIds++;
    w_obj = {};
    w_obj.name = "WIND";
    w_obj.id = co_self.windsForcesIds;
    w_obj.layer = l;
    w_obj.force = 1
    w_obj.setWindForce = function(newVal){
      this.force = newVal
    };
    co_self.windsForces[w_obj.id] = w_obj;

    co_self.windsForcesInterval[w_obj.id] = setInterval(function(id){
      layer = co_self.windsForces[id].layer;
      makeForce = true
      for (var k = 0; k < co_self.XFORCES.length; k++) {
        if(co_self.XFORCES[k].layer == layer) makeForce = false;
      }
      wind_objects = co_self.objectsByLayer[layer];

      for (var i = 0; i < wind_objects.length; i++) {
        wind_objects[i].X_Force = co_self.windsForces[id].force / (wind_objects[i].mass+1);

        // if(wind_objects[i].layer != layer ) console.log(wind_objects[i].name)
        if(wind_objects[i].X_Force > 0){
          if(makeForce){
            wind_objects[i].setPosX(wind_objects[i].posX + wind_objects[i].X_Force)
          }
        }
      }

    },10,(w_obj.id))

    return w_obj;

  }

  co_self.gravityForcesIds = -1;
  co_self.gravityForces = Array();
  co_self.gravityForcesInterval = Array();

  co_self.startGravity = function(l){
    co_self.gravityForcesIds++;
    g_obj = {};
    g_obj.name = "GRAVITY";
    g_obj.id = co_self.gravityForcesIds;
    g_obj.layer = l;
    g_obj.force = (9.8/10)*(-1)
    g_obj.setGravity = function(newVal){
      this.force = (newVal/10)*(-1)
    };
    co_self.gravityForces[g_obj.id] = g_obj;

    co_self.gravityForcesInterval = setInterval(function(id){
      layer = co_self.gravityForces[id].layer;
      gravityForce = co_self.gravityForces[id].force;
      g_objects = co_self.objectsByLayer[layer];

      for (var i = 0; i < g_objects.length; i++) {
        if(g_objects[i].static == 0 ){
          newY =  g_objects[i].posY+g_objects[i].Y_Force
          if(g_objects[i].Y_Force != 0 && g_objects[i].Y_Force > 0){
            if(g_objects[i].setPosY(newY)) g_objects[i].Y_Force = (g_objects[i].Y_Force + gravityForce)/ ((g_objects[i].mass > 0) ? g_objects[i].mass : 1) ;
          }else{
            if(g_objects[i].setPosY(newY)) g_objects[i].Y_Force = (g_objects[i].Y_Force + gravityForce)/ ((g_objects[i].wind_resistence > 0) ? g_objects[i].wind_resistence : 1) ;
          }
        }
      }
    },10,(g_obj.id));

    return g_obj;
  }

  co_self.XFORCESIds = -1;
  co_self.XFORCES = Array();
  co_self.XFORCESInterval = Array();
  co_self.startXFORCES = function(l){
    co_self.XFORCESIds++;
    xf_obj = {};
    xf_obj.name = "X_FORCE";
    xf_obj.id = co_self.XFORCESIds;
    xf_obj.layer = l;

    co_self.XFORCES[xf_obj.id] = xf_obj;

    co_self.XFORCESInterval[xf_obj.id] = setInterval(function(id){
      layer = co_self.XFORCES[id].layer;
      XForces_objects = co_self.objectsByLayer[layer];
      for (var i = 0; i < XForces_objects.length; i++) {
        if(XForces_objects[i].X_Force != 0){
          XForces_objects[i].setPosX(XForces_objects[i].posX + XForces_objects[i].X_Force)
        }
      }

    },10,(xf_obj.id))

    return xf_obj;

  }

}
