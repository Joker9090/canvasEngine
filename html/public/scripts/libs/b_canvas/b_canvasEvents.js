CanvasEvents = function(){
  ce_self = this;
  ce_self.KeyEvents = Array();
  ce_self.KeyEventsIntervals = Array();
  ce_self.addKeyEvent = function(k,fn){
    if(typeof k == "object") { ce_self.parseObjectKeyEvent(k) }
    else { ce_self.KeyEvents[k] = fn
        tempObj = {
          keyCode  : k,
          function : fn,
          delay: 500
        };
        ce_self.parseObjectKeyEvent(tempObj);
    }
  }
  ce_self.parseObjectKeyEvent = function(obj){
      ce_self.KeyEvents[obj.keyCode] = obj
  }
  ce_self.keyEventStart = function(){
    window.onkeydown = function(e){
      if(typeof ce_self.KeyEvents[e.keyCode] == "object") {
        if(typeof ce_self.KeyEventsIntervals[e.keyCode] == "undefined" ){
          ce_self.KeyEvents[e.keyCode].function();
          ce_self.KeyEventsIntervals[e.keyCode] = setInterval(function(keyCode){
            ce_self.KeyEvents[keyCode].function();
         },ce_self.KeyEvents[e.keyCode].delay,(e.keyCode))
        }
      }
    }
    window.onkeyup = function(e){
      if(typeof ce_self.KeyEvents[e.keyCode] == "object") {
        if(typeof ce_self.KeyEventsIntervals[e.keyCode] != "undefined"){
          clearInterval(ce_self.KeyEventsIntervals[e.keyCode])
          ce_self.KeyEventsIntervals[e.keyCode] = undefined;
        }
      }
    }

  }()
}
