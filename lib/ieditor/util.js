( function(exports) {
    'use strict';
    function merge(array, delim) {
        if (delim === undefined) {
            delim = '';                
        }
        return array.join(delim);        
    }
    
    exports.merge = merge;
    
}( typeof exports === 'undefined' ? ( Util = {}) : exports));
