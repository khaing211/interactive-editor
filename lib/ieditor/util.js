( function(exports) {
    'use strict';
    function merge(array, delim) {
        if (delim === undefined) {
            delim = '';                
        }
        
        var result = '', i, len;
				/*
        for (i = 0, len = array.length; i < len; i += 1) {
            result += array[i];
            if (i < (len-1)) {
                result += delim;
            }
        }
				*/
        return array.join(delim);        
    }
    
    exports.merge = merge;
    
}( typeof exports === 'undefined' ? ( Util = {}) : exports));
