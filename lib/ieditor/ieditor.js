var IEditor = (function() {
    
    /*
     * Input is idea of document body
     */
    function IEditor(editorPlace, terminalPlace) {
        
        
        function clone(obj) {
            // Handle the 3 simple types, and null or undefined
            if (null == obj || "object" != typeof obj) return obj;
        
            // Handle Date
            if (obj instanceof Date) {
                var copy = new Date();
                copy.setTime(obj.getTime());
                return copy;
            }
        
            // Handle Array
            if (obj instanceof Array) {
                var copy = [];
                for (var i = 0, var len = obj.length; i < len; ++i) {
                    copy[i] = clone(obj[i]);
                }
                return copy;
            }
        
            // Handle Object
            if (obj instanceof Object) {
                var copy = {};
                for (var attr in obj) {
                    if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
                }
                return copy;
            }
        
            throw new Error("Unable to copy obj! Its type isn't supported.");
        }
        
        
        function or(func1, func2) {
            return function(change) {
                
            }
        }
        
        function jsFunc(ch, line) {
            return new function() {
                this.ch = ch;
                this.line = line;
                this.getCoord = function() {
                    return {ch: this.ch, line: this.line};
                }
                this.parse = function (change) {
                    
                }; 
            };
        }
        
        function jsStmtList() {
            
        }
        
        /*
         * parse only one change.
         * Change AST accordingly
         */
        function parseOneChange(astRoot, change) {
            // TODO: locate first node impacted by change.from
            // TODO: insert/replace/delete part of ast by using higher order function 
        }
        
        
        /*
         * Assume: changes contains at least one change
         */
        function parse(astRoot, changes) {
            parseOneChange(changes);
            while (changes.hasOwnProperty('next')) {
                changes = changes[next];
                parseOneChange(changes);    
            } 
        }
                                               
        function editorOnChange(editor, changes) {
            // TODO:
            console.log("editorOnChange");
            console.log(changes);
        }
        
        function terminalOnChange(terminal, changes) {
            // TODO:
            console.log("terminalOnChange");
            console.log(changes);            
        }        
        
        var editorTextArea = document.getElementById(editorPlace);
        var terminalTextArea = document.getElementById(terminalPlace);
        
        if (!editorTextArea) {
            console.log("editor element doesn't exist.");
            return;            
        }
        
        if (!terminalTextArea) {
            console.log("terminal element doesn't exist.");
            return;
        }
        
        CodeMirror.fromTextArea(editorTextArea, {
            mode: "javascript",
            indentUnit: 4,
            lineNumbers: true,
            onChange: editorOnChange
        });
        
        CodeMirror.fromTextArea(terminalTextArea, {
            mode: "javascript",
            onChange: terminalOnChange
        });

    }

    return IEditor;
})();
