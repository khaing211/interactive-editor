( function(exports) {
    'use strict';
    function merge(array, delim) {
        if (delim === undefined) {
            delim = '';                
        }
        
        var result = '', i, len;
        for (i = 0, len = text.length; i < len; i += 1) {
            result += text[i];
            if (i < (len-1)) {
                result += delim;
            }
        }
        return result;        
    }
    
    exports.merge = merge;
    
}( typeof exports === 'undefined' ? ( Util = {}) : exports));