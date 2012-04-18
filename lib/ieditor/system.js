( function(exports) {
    var stream = [];
    function push(line, inst) {
        stream.push({line: line, inst: inst});
    }
    
    function getStream() {
        return stream;
    }
    
    
    // Put our API into export
    exports.push = push;
    exports.getStream = getStream;
    
} (typeof exports === "undefined"? (system = {}) : exports));
