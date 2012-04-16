var IEditor = (function() {

    /*
     * Input is idea of document body
     */
    function IEditor(editorPlace, terminalPlace) {
        
        var esprima_options = {
            comment: false,
            raw: false,
            range: false,
            loc: true
        };
        // good timer between series of input
        var parserTimeout = 850; //ms
        var timerId;
        
        function parse() {
            // clear out timer id
            timerId = undefined;
            try {                
                var tree = esprima.parse(editor.getValue(), esprima_options);
                var snapshot = Tracer.trace(tree);                              
                Format.align(editor, snapshot);
                
                
            } catch (e) { }
        }
        
        function editorOnChange(editor, changes) {            

            if (timerId !== undefined) {
                window.clearTimeout(timerId);
            }
            
            // create new timer
            timerId = window.setTimeout(parse, parserTimeout);            
        }

        function terminalOnChange(terminal, changes) {
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

        var editor = CodeMirror.fromTextArea(editorTextArea, {
            mode: "javascript",
            indentUnit: 4,
            lineNumbers: true,
            onChange: editorOnChange
        });

        var terminal = CodeMirror.fromTextArea(terminalTextArea, {
            mode: "javascript",
            onChange: terminalOnChange
        });

        return {editor: editor, terminal: terminal};

    }

    return IEditor;
})();
