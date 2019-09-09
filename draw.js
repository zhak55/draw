/*!
 * Drawing with canvas v1.0
 * 
 *
 * Copyright 2014 Roman Zhak
 * Released under the MIT license
 */
 

(function(window) {
	
	var  x = [], y = [], 
	alpha = 1, //globalAlpha
	color = "rgb(94, 130, 168)", 
	size = 35, 
	on = false, 
	cache, 
	cachePreviousImage = [],
	is = !!document.createElement('canvas').getContext,
	browser = navigator.userAgent.toLowerCase()
	, ua = {
		opera : /opera/i.test( browser ) || /opr/.test ( browser ),
		version : ( browser.match(/.+(?:era|opr)[\/: ]([\d.]+)/ ) || [0,0])[1]
		}
	, counter = 0
	, eventsHandler = function(event) {
         var handlers = this.events[event.type]
       for ( var g in handlers ) {
        var ret = handlers[g].call(this, event)
        if ( ret === false ) {
        event.preventDefault()
        event.stopPropagation()
    }
  }

	}
		 
		 
 window.Draw = { 
 
   init : function() {
	   var d = document;
	     this.elem = d.getElementById('draw');
	     this.ctx = d.getElementById('draw').getContext('2d');

	  var left = Draw.offset( this.elem )[0];
	  
	   	this.byClass = document.getElementById('colorcur');
		
		   
	   var save = document.getElementById('save'), last = document.getElementById('restore');
	   if( left < 125 ) save.style.left = '';
	     else  save.style.right = '';
	   
	       save.style[left < 125 ? 'right' : 'left'] = ( left < 125 ? ( left - 135 ) : ( left - 125 )  ) + 'px';
		   save.style.top = ( Draw.offset( this.elem )[1] - 7 ) + 'px';
		   
		  
		   var html = document.documentElement;

		  var scrolls  = html.scrollLeft;
		//  console.log ( scrolls );
		   //html.scrollLeft = scrolls;
		   
		return this;
		
	},
   events : function() {
	  
	   
	    Draw.callHandlers('resize', Draw.init, window );
	    Draw.callHandlers('mouseup', Draw.remove, document );
		  Draw.callHandlers('mousedown', Draw.start, Draw.elem);
		  Draw.callHandlers('click', Draw.saveToRestore, Draw.elem);
		
	   Draw.elem.addEventListener('mousedown', function() {
		   document.getElementById('on').removeAttribute('disabled');
	   }, false );

	   return this;
	
   },
   callHandlers : function(type, handler, elem) {
	   
	   var elem = elem || document;
	   
	  if (!handler.counter) 
            handler.counter = ++counter
	  
	 if (!elem.events) {
	        elem.events = {}
            elem.handle = function(event) {
                 return eventsHandler.call(elem, event)
           }
        }
	  if (!elem.events[type]) {
             elem.events[type] = {}        
  
      elem.addEventListener(type, elem.handle, false)
	  
    }
   
    elem.events[type][handler.counter] = handler
	   
   },
   deleteHandler : function(elem, type, handler) {
	   
	   var handlers = elem.events && elem.events[type]  
        if (!handlers) return
      delete handlers[handler.counter];
	  
	   for(var any in handlers) return;

      elem.removeEventListener(type, elem.handle, false)

    
        delete elem.events[type]
  
	   
	   
   },
   
   removeEvents : function() {
	    // Draw.deleteHandler(this.byClass, 'click', clicks2  )
	    // Draw.deleteHandler(this.byClass, 'click', clicks  )
		
   },
   offset : function( e ) {
	   var left = 0, top = 0;
	 while(e) {
        top = top + parseInt(e.offsetTop);
        left = left + parseInt(e.offsetLeft);
        e = e.offsetParent; 
	}
    return [left, top];  
   },
   sizeSet : function( self ) {
	 size = self.value;
	 //console.log( self.value );  
   },
   saveToRestore : function(e, restore) {
	 var counter = cachePreviousImage.length - 1;
	   if(!restore)
	     cachePreviousImage.push(  Draw.ctx.getImageData( 0, 0, 1000, 500 ) );
	   if(restore && counter >= 2) {
         Draw.ctx.putImageData(cachePreviousImage[counter - 1], 0, 0);
		 cachePreviousImage.splice(0, counter - 1);
	   }
	   if ( counter <= 1 && restore ) Draw.clear();
   },
   getMouseOffset : function(e) {
	 var x1 = Draw.offset(Draw.elem)[0], y1 = Draw.offset(Draw.elem)[1];
	// console.log(x1);
	 	  			x.push((e.pageX  - x1));
			   y.push((e.pageY  - y1));
	  return [parseInt(e.pageX  - x1), e.pageY  - y1];


   },
   remove : function() {   
	   document.removeEventListener('mousemove', Draw.doDraw, false);
	   x = [], y = [];
	   alpha += 0.3
   },
   clear : function() {
	   document.getElementById('restore').removeChild( Draw.elem );
	     var canvas = document.createElement('canvas');
		     canvas.width = 1000;
			 canvas.height = 500;
			 canvas.id = 'draw';
		document.getElementById('restore').appendChild( canvas );
		document.getElementById('on').setAttribute('disabled');
		// refresh all
		x = [], y = [];
		Draw.init().events().genColors();
   },
   start : function() {
	   
	   	   document.addEventListener('mousemove', Draw.doDraw, false);
	
   },
   doDraw :  function(e) {
	   try {
			  
            window.getSelection().removeAllRanges();
		  
         } catch(e) {}

			   var getXY  = Draw.getMouseOffset(e);
                 var lenX = x.length, lenY = y.length;

		   Draw.ctx.strokeStyle = color;

    Draw.ctx.lineWidth = size;
    Draw.ctx.lineCap = "round";
    Draw.ctx.lineJoin = "round";
	
   Draw.ctx.beginPath();
    Draw.ctx.moveTo(getXY[0], getXY[1]);
    Draw.ctx.lineTo((x[lenX - 2] + 0.5), (y[lenY - 2] + 0.5));
 
    Draw.ctx.stroke();
    Draw.ctx.closePath();
   },
   brushClear : function( off ) {
	if(!on && !off) {
	   cache = color;
	   color = '#ffffff';
	   document.getElementById('brush').style.opacity = 1;
	   on = true;
	}else {
	 color = cache;
	 on = false;  
	 document.getElementById('brush').style.opacity = 0.5;
	}
   },
   setColor : function( type ) { 
   Draw.brushClear(true); 
	  color = type 
	  document.getElementById('colorcur').style.background = type;
   },
    getImage: function() {
		var func = Draw.elem.toDataURL();
		  var img = new Image();
		   img.onload = function() {
			   var ce = document.createElement('img');
			       ce.style.width = '100px';
				   ce.style.height = '65px';
				   ce.className = 'saveImg'
				   ce.src = img.src ;
				   
				 document.getElementById('save').appendChild( ce );
			   
		   };
		 img.src = func;
		 
		
    
  },
   genColors : function() {
	   var randColor = {
         rV  :  function(val) {
                return Math.floor(Math.random() * val); },
       get :  function() {
         var r = this.rV(255).toString(16);
             if(r.length < 2)
                        r = "0" + r;
         var g = this.rV(255).toString(16);
             if(g.length < 2)
                        g = "0" + g;
         var b = this.rV(255).toString(16);
             if(b.length < 2)
                             b = "0" + b;
       return "#" + r + g + b;
    }
	   }
	   
	var html = '<table cellpadding="3" cellspacing="0" border="0">',
	 i = 0, j, rnd;
	   for ( ; i < 5; i++) {
		  html += '<tr>';
		  j = 0;
		   for( ; j < 12; j++) {
		    rnd = randColor.get();
		    html += '<td class="set" style="background:' + rnd + ';" onclick="return Draw.setColor(\'' + rnd + '\');"></td> ';
		  }
			  html += '<\/tr>';
			  
	   }

	 html += '<\/table>';
     document.getElementById('color').innerHTML = html;
   }
		
 }
// call methods if it is possible
if(!is || ( parseInt(ua.version) < 10 && ua.opera) ) {	
	   document.write('Your browser is <b>too old</b> to work with such beautiful thing like canvas!');
	   return false;
  }else {
 
 var domReady = function() {
	 
    Draw.init().events().genColors();
	Draw.deleteHandler(document, 'DOMContentLoaded', domReady);
 };
 
 Draw.callHandlers("DOMContentLoaded", domReady );

}

})(window);
