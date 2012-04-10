var IEditor = (function() {
    
    /*
     * Input is idea of document body
     */
    function IEditor(editorPlace, terminalPlace) {                
        function editorOnChange(editorInstance, change) {
            // TODO:
            console.log("editorOnChange");
            console.log(change);
        }
        
        function terminalOnChange(terminalInstance, change) {
            // TODO:
            console.log("terminalInstance");
            console.log(change);            
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
