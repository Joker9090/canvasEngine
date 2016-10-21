ExtraScripts = function(){
 self = this;
 self.id = 0;
 self.engineCallScript = function(scriptUrl,end){
   _script = document.createElement("SCRIPT");
   _script.className = "extraScript-" + self.id;
   self.container.appendChild(_script);

   _script.onload = function () { if(typeof end == "function") end(); };

   _script.onerror = function () { console.log("Error calling script main " + scriptUri); };

   _script.src = self.search4Url(scriptUrl);
   self.id++;
 };
 self.callScript = function(scriptUrl,end){
   switch (true) {
     case scriptUrl instanceof Array && scriptUrl.length == 0:
      end();
     break;
     case scriptUrl instanceof Array:
       self.engineCallScript(scriptUrl[0],function(){
        scriptUrl.shift();
        self.callScript(scriptUrl,end)
       });
     break;
     case typeof scriptUrl == "string":
      self.engineCallScript(scriptUrl,end);
     break;
     default:
      console.log("Type Error");
   }
 };
 self.asyncId = 0;
 self.max = [];
 self.timers = [];
 self.callAsyncScript = function(scriptUrl,end){
  this.id = self.asyncId;
  self.asyncId++;
  self.max[this.id] = scriptUrl.length;
  for (var i = 0; i < scriptUrl.length; i++) {
     setTimeout(function(id,globalId){
       self.engineCallScript(scriptUrl[id],function(){  self.max[globalId]--; });
     },50,(i),(this.id));
  }
  self.timers[this.id] = setInterval(function(id){
    if(self.max[id] == 0){
      clearInterval(self.timers[id]);
      end();
    }
  },50,(this.id));

 }
 self.urls = {};

 self.setUrls = function(obj){ self.urls = obj; };

 self.search4Url = function(url){
   return (typeof self.urls[url] == "string") ? self.urls[url] : url ;
 };

 self.container = document.getElementsByTagName("BODY")[0];
 self.setContainer = function(newElement){
   self.container = newElement;
 };
   return self;
};

extraScript = new ExtraScripts();
