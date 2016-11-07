uris = {
  "b_logs"   : "/html/public/scripts/libs/b_logs/b_logs.js",
  "b_canvas" : "/html/public/scripts/libs/b_canvas/b_canvas.js",
  "b_canvasObjects" : "/html/public/scripts/libs/b_canvas/b_canvasObjects.js",
  "b_canvasEvents"  : "/html/public/scripts/libs/b_canvas/b_canvasEvents.js",
  "game"  : "/html/public/scripts/game.js",
};

extraScript.setUrls(uris);
extraScript.callScript("b_logs",start);

function start(){
  window.doInResizeFunctions = [];
  window.onresize = function(){
    function _doInResizeFunctions(fs){
      for (var i = 0; i < fs.length; i++) { fs[i](); }
    }
    if(doInResizeFunctions.length > 0) _doInResizeFunctions(doInResizeFunctions);
  };
  doInResizeFunctions[doInResizeFunctions.length] = makeContentGoodAgain
  makeContentGoodAgain();
  extraScript.callAsyncScript(["b_canvas","b_canvasObjects","b_canvasEvents"],function(){
    extraScript.callScript("game");
  });
}

function makeContentGoodAgain() {
  footer = document.getElementById("footer");
  ctn = document.getElementById("content");
  header = document.getElementById("header");
  newCtnHeight = window.innerHeight - (footer.offsetHeight+header.offsetHeight)
  ctn.setAttribute("style","height:"+newCtnHeight+"px");
  if(ctn.offsetHeight+header.offsetHeight > window.innerHeight) {
    footer.setAttribute("class","")
  }else{ footer.setAttribute("class","pushedBot") }
}

function ajax(url, method, callback, params = null) {
   var obj;
   try {
    obj = new XMLHttpRequest();
   } catch(e){
     try {
       obj = new ActiveXObject("Msxml2.XMLHTTP");
     } catch(e) {
       try {
         obj = new ActiveXObject("Microsoft.XMLHTTP");
       } catch(e) {
         alert("Your browser does not support Ajax.");
         return false;
       }
     }
   }
   obj.onreadystatechange = function() {
    if(obj.readyState == 4) {
       callback(obj);
    }
   }
   obj.open(method, url, true);
   obj.send(params);
   return obj;
 }

loader = function(){
  lo_self = {}
  lo_self.get = undefined;
  lo_self.itemsToLoad = undefined;
  lo_self.progress = 0;
  lo_self.itemsAlreadyLoaded = 0;
  lo_self.setItemsToLoad = function(items){
    lo_self.itemsToLoad = items
  }
  lo_self.load = function(item,withName){
    lo_self.progress += Math.floor(100/ lo_self.itemsToLoad.length)
    lo_self.itemsAlreadyLoaded++;
    if(lo_self.itemsAlreadyLoaded == lo_self.itemsToLoad.length){
      lo_self.progress = 100;
      lo_self.remove();
    }
    if(withName === true) {
      lo_self.drawProgress(item);
    }else{
      lo_self.drawProgress();
    }

  }
  lo_self.drawProgress = function(name){
    if(typeof lo_self.get != "undefined"){
      if(typeof name !== "undefined"){
        lo_self.get.childNodes[0].innerHTML = "LOADING " + name +"... "+lo_self.progress+"%" ;
      }else{
        lo_self.get.childNodes[0].innerHTML = "LOADING "+lo_self.progress+"%" ;
      }
    }
  }
  lo_self.make = function(){
    if(typeof lo_self.get != "undefined"){
      console.clog("LOADER ALREADY DEFINED");
      return false;
    }
    _loader = document.createElement("DIV");
    _loader.setAttribute("id","loader");
    _loaderContent = document.createElement("SPAN");
    _loaderContent.innerHTML = "LOADING";
    _loader.appendChild(_loaderContent);

    BODY = document.getElementsByTagName("BODY")[0];
    BODY.appendChild(_loader);
    lo_self.get = document.getElementById("loader")
  }
  lo_self.remove = function(){
    lo_self.get.remove();
    lo_self.get = undefined;
    lo_self.progress = 0;
    lo_self.itemsToLoad = undefined;
    lo_self.itemsAlreadyLoaded = 0;
  }
  return lo_self;
}
