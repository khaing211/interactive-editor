( function(exports) {
    
    function getAjax() {
        if (window.XMLHttpRequest) {
            return new XMLHttpRequest();
        } 
        else if (window.ActiveXObject) {
            return new ActiveXObject("Microsoft.XMLHTTP");
        }
        else {
            return undefined;
        }
    }
    
    var ajax = getAjax();
    var queue = [];
        
    function makeCallback(callback) {
        return function() {
            if (ajax.readyState == 4) {
                callback(ajax.responseText);
                if (queue.length != 0) {
                    var request;
                    do {
                        request = queue.shift();
                    } while (!load(request.src, request.callback));
                }
            }
        }
    }

    function load(src, callback) {
        // If ajax is not in middle of making call
        if (ajax.readyState == 4 || ajax.readyState == 0) {
            ajax.open("GET", src, true);
            //Set the function that will be called when the XmlHttpRequest objects state changes.
            ajax.onreadystatechange = makeCallback(callback); 
            //Make the actual request.
            try {
                ajax.send(null);
            } catch (e) {
                console.log(e);
                console.log(src);
                return false;
            }            
        }   
        else {
            // queue
            queue.push({src: src, callback: callback});
        }
        return true; 
    }
    
    exports.load = load;
    
} (typeof exports === "undefined"? (Ajax = {}) : exports));