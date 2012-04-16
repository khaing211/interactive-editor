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
        // in unit of millisecond (good timer between series of input)
        var parserTimeout = 900;
        var timerId;
        
        function parse() {
            // clear out timer id
            timerId = undefined;
            try {                
                tree = esprima.parse(editor.getValue(), esprima_options);
                console.log(tree);
            } catch (e) {
                // DO nothing, because user input is incomplete
            }
        }
        
        function editorOnChange(editor, changes) {            
            // console.log("editorOnChange");
            // console.log(changes);
            if (timerId !== undefined) {
                window.clearTimeout(timerId);
            }
            
            // create new timer
            timerId = window.setTimeout(parse, parserTimeout);            
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
