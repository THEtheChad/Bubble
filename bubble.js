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

    // Public API
    window['bubble'] = {
        'color': [['rgba(200,0,10,.2)','rgba(200,0,10,.4)']],
        'pulse': [1],
        'delay': [150],
        'speed': [2],
        'size': [20]
    };

    var doc = document,
        html = doc.getElementsByTagName('html')[0],
        style = doc.createElement('style'),
        bubbleEl = doc.createElement('b'),
        backgroundImage = 'backgroundImage',
        random = Math.random,
        round = Math.round,
        prefixes = ['', '-o-', '-ms-', '-moz-', '-webkit-'],
        prefix;

    html.appendChild( style );

    // Detect which w3c gradient syntax is supported and return the prefix
    // (undefined if no support)
    while( prefix = prefixes.pop() ){
        bubbleEl.style[backgroundImage] = prefix + 'linear-gradient(0,#007,#9f9)';
        if(bubbleEl.style[backgroundImage].indexOf( 'linear' ) + 1) break;
    }
    
    if( prefix == undefined )
        return;

    // Actually creating the bubble
    bubbleEl.className = 'bubble';
    var createBubble = function(e){
        var color = bubble['color'][round(random() * (bubble['color'].length - 1))],
            duration = bubble['speed'][round(random() * (bubble['speed'].length - 1))],
            radius = bubble['size'][round(random() * (bubble['size'].length - 1))],
            inner = radius * 3 / 4,
            outer = inner + radius / 9,
            diameter = radius * 2,
            newNode = bubbleEl.cloneNode(),
            x = 0,
            y = 0;
            
        if(e){
            if(e.pageX || e.pageY){
                x = e.pageX;
                y = e.pageY;
            }
            else if(e.clientX || e.clientY){
                x = e.clientX + doc.body.scrollLeft;
                y = e.clientY + doc.body.scrollTop;
            }
        }

        newNode.style.left = x - radius + 'px';
        newNode.style.top = y - radius + 'px';
        newNode.style.height = diameter + 'px';
        newNode.style.width = diameter + 'px';
        
        newNode.style[backgroundImage] = prefix +
            'radial-gradient(circle contain,' +
            color[0] + ' ' + inner + 'px,' +
            (color[1] || color[0]) + ' ' + outer + 'px,' +
            'transparent ' + radius + 'px)';

        newNode.style[prefix + 'animation-duration'] = duration + 's';
        
        function destroyBubble(){
            html.removeChild(newNode);
            newNode = null;
        };
        
        // Just add both event handlers, only one will trigger.
        // We should do proper event detection.
        newNode.addEventListener('webkitAnimationEnd', destroyBubble);
        newNode.addEventListener('animationend', destroyBubble);              
        
        html.appendChild(newNode);
    }

    style.innerHTML = '.bubble{' +
        'position:absolute;z-index:1000;' +
        prefix + 'animation-name:pop;' +
        prefix + 'animation-timing-function:ease}' +
        '@' + prefix + 'keyframes pop{' +
        '0%{' +  prefix + 'transform:scale(1)}' +
        '70%{' + prefix + 'transform:scale(5)}' +
        '100%{opacity:0}}';
    
    html.onclick = function(e){
        var i = bubble['pulse'][round(random() * (bubble['pulse'].length - 1))],
            delay = bubble['delay'][round(random() * (bubble['delay'].length - 1))];
    
        while( i )
            setTimeout(function(){
                createBubble(e);
            }, delay * --i);
    };

})();