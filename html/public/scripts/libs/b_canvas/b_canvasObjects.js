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
        co_self.objectsByLayer[v][co_self.objectsByLayer[v].length] = this;
        co_self.removeFromLayers(this.layer,this.id);
        this.layer = v;
      },
      name : (typeof name == undefined ) ? "map" : name,
      visible : true,
      width : co_self.canvas.c.width,
      height : co_self.canvas.c.height,
      posX : 0,
      focusPosX : 0,
      setPos: function(x,y){
        this.setPosX(x);
        this.setPosY(y);
        co_self.checkPhysics(this.layer);
      },
      setPosX : function(val){ this.posX = val; },
      calculePosX : function() { return this.posX; },
      posY : 0,
      focusPosY : 0,
      setPosY : function(val){ this.posY = val; },

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
          }
        }else{
          this.mapObjects[this.mapObjects.length] = obj;
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
        for (var i = 0; i < this.mapObjects.length; i++) {
          if(typeof this.mapObjects[i].draw == "function") this.mapObjects[i].draw()
        }
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
    return co_self.canvas.c.height - y - h
  };

  co_self.createObject = function(type){
    co_self._mapsimageTotals++;
    _object = {
      setPos: function(x,y){
        this.setPosX(x);
        this.setPosY(y);
        co_self.checkPhysics(this.layer);
      },
      setPosX : function(val){ this.posX = val; },
      setPosY : function(val){ this.posY = val; },
      name: "",
      focus: false,
      weight: 0,
      aceleration:0,
      gravityForce:0,
      extraForce:0,
      extraForceAngle:0,
      windSpeed:0,
      speed:0,
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
    if(_object.type != 'mapObject' || _object.type != 'mapObjectFocus'){
      if(typeof co_self.objectsByLayer[_object.layer] == "undefined"){
        co_self.objectsByLayer[_object.layer] = Array();
      }
      co_self.objectsByLayer[_object.layer][co_self.objectsByLayer[_object.layer].length] = _object;
    }

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
      if(co_self.objectsByLayer[l][i].id == id) co_self.objectsByLayer[l][i].remove();
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

  co_self.checkPhysics = function(layer){
    console.log(layer)
  }

  co_self.startWind = function(wf){
    //windForce
    this.interval = setInterval(function(){
      objects = co_self.getAllObjects();
        for (var i = 0; i < objects.length; i++) {
          if(objects[i].windSpeed > 0){
            objects[i].setPosX(objects[i].posX+objects[i].windSpeed*wf)
          }
        }
    },50)
  }

}
