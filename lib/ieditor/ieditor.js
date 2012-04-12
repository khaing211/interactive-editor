var IEditor = (function() {
    
    /*
     * Input is idea of document body
     */
    function IEditor(editorPlace, terminalPlace) {
              
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
