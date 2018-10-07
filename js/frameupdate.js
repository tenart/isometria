app.ticker.add(function(delta) {
    // just for fun, let's rotate mr rabbit a little
    // delta is 1 if running at 100% performance
    // creates frame-independent transformation
    
    app.renderer.resize(window.innerWidth, window.innerHeight);
    
    //container.x = (window.innerWidth - container.width) / 2;
    //container.y = (window.innerHeight - container.height) / 2;
        
    container.x = window.innerWidth/2;
    container.y = window.innerHeight/1.5;
    
    if(w) {
        playerSprite.y --;
    }
    if(s) {
        playerSprite.y ++;
    }
    if(a) {
        playerSprite.x --;
    }
    if(d) {
        playerSprite.x ++;
    }
    
    
    
    
    /*
    document.getElementById('debug-coordinates').innerHTML = 
        '<p>Container width: ' + container.width + ' </p>'
        + '<p>Container height: ' + container.height + '</p>'
        + '<p>Window width: ' + window.innerWidth + ' </p>'
        + '<p>Window height: ' + window.innerHeight + '</p>'
        ;
    */
});