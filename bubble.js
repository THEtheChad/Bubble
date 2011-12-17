/**!
 * @preserve bubbleClick
 * Copyright 2011 THEtheChad Elliott
 * Released under the MIT and GPL licenses.
 * Original author: Digitpaint 2011 (Advent Calender)
 */

// Use of the ['method'] syntax is necessary to maintain
// references for the public API when using Google Closure
// to compress the file
// http://closure-compiler.appspot.com/home

;(function(){

    var doc = document,
        html = doc.childNodes[1];

    window['bubble'] = {
        'colors': ["54, 20, 62"],
        'count': 1,
        'spacing': 150
    };

    // Detect which w3c gradient syntax is supported and return the prefix
    // (undefined if no support)
    var prefix = (function(){
        var syntaxCheck = doc.createElement('i').style,
            backgroundImage = 'backgroundImage',
            prefixes = ['-o-', '-ms-', '-moz-', '-webkit-', ''],
            i = prefixes.length;
            
        while( i ){
            syntaxCheck[backgroundImage] = prefixes[--i] + 'linear-gradient(0,#007,#9f9)';
            if(syntaxCheck[backgroundImage].indexOf( 'linear' ) + 1)
                return prefixes[i];
        }
    })();
    
    // Function to set the gradient
    var setBubbleGradient = function(bubbleEl, color){
      if( prefix != undefined )
        bubbleEl.style.backgroundImage = prefix + "radial-gradient(circle contain, rgba(" + color + ", 0.2) 16px, rgba(" + color + ", 0.3) 17px, transparent 20px)";
    };
    
    // Actually creating the bubble
    var createBubble = function(x, y){
        var color = bubble['colors'][Math.round(Math.random() * (bubble['colors'].length - 1))];
        
        var bubbleEl = doc.createElement("b");
        bubbleEl.className = "bubble";
        bubbleEl.style.left = x + "px";
        bubbleEl.style.top = y + "px";
        
        setBubbleGradient(bubbleEl, color);
        
        function disposeBubble(){
        html.removeChild(bubbleEl);
        bubbleEl = null;
        };
        
        // Just add both event handlers, only one will trigger.
        // We should do proper event detection.
        bubbleEl.addEventListener("webkitAnimationEnd", disposeBubble);
        bubbleEl.addEventListener("animationend", disposeBubble);              
        
        
        html.appendChild(bubbleEl);
    }
    
    // The event handler
    var onBubbleClick = function(e){
        var mouse = getEventMousePosition(e);
        
        createBubble(mouse.x, mouse.y);
    }
    
    // Get the mouse coordinates from an event
    var getEventMousePosition = function(e){
        var loc = {
                x: 0,
                y: 0
            }
    
        if(e){               
            if(e.pageX || e.pageY){
                loc.x = e.pageX;
                loc.y = e.pageY;
            }
            else if(e.clientX || e.clientY){
                loc.x = e.clientX + doc.body.scrollLeft;
                loc.y = e.clientY + doc.body.scrollTop;
            }
        }
        return loc;
    }
    
    var css =
        '.bubble{position:absolute;width:40px;height:40px;z-index:1000;' +
            prefix + 'animation-name:pop;' +
            prefix + 'animation-duration:2s;' +
            prefix + 'animation-timing-function:ease}@' + prefix +
            'keyframes pop{0%{' +  prefix + 'transform:scale(1)}70%{' + prefix + 'transform:scale(5)}100%{opacity:0}}';

    var style = doc.createElement('style');
    style.innerHTML = css;

    html.appendChild( style );
    
    html.onclick = function(e){
        var i = bubble['count'];
    
        while( i )
            setTimeout(function(){
                onBubbleClick(e);
            }, bubble['spacing'] * --i);
    };

})();