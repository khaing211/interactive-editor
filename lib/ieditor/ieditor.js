var IEditor = (function() {

    /*
     * Input is idea of document body
     */
    function IEditor(editorPlace, terminalPlace, systemPlace) {
        
        var esprima_options = {
            comment: false,
            raw: false,
            range: false,
            loc: true
        };
        // good timer between series of input
        var parserTimeout = 850; //ms
        var timerId;
        var isAutoFormatted = false;
        
        function parse() {
            // clear out timer id
            timerId = undefined;
            try {
                var cachedEditorValue = editor.getValue();
                var tree = esprima.parse(cachedEditorValue, esprima_options);
                var snapshot = Tracer.trace(tree);
                // console.log(snapshot);
                Format.align(cachedEditorValue, terminal, snapshot);
                //isAutoFormatted = true;
                //editor.setValue(result.format);
                //var curloc = editor.getCursor();                
                
            } catch (e) { }
        }
        
        function mergeText(text) {
            
        }
        
        function editorOnChange(editor, changes) {
            do {
                // Put into terminal
                terminal.replaceRange(Util.merge(changes.text), changes.from, changes.to);                
            } while (changes = changes.next)
                        
            if (isAutoFormatted) {
                isAutoFormatted = false;
            }
            else {
                if (timerId !== undefined) {
                    window.clearTimeout(timerId);
                }
                
                // create new timer
                timerId = window.setTimeout(parse, parserTimeout);
            }            
        }
        
        function editorOnScroll() {
            
        }

        function terminalOnFocus() {
            
        }
        
        function terminalOnBlur() {
            
        }
        
        function terminalOnScroll() {
            
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
            matchBrackets: true,
            onChange: editorOnChange,
            onScroll: editorOnScroll
        });

        var terminal = CodeMirror.fromTextArea(terminalTextArea, {
            mode: "javascript",
            readOnly: true,
            onFocus: terminalOnFocus,
            onBlur: terminalOnBlur,
            onScroll: terminalOnScroll
        });
                
        return {editor: editor, terminal: terminal};
    }

    return IEditor;
})();
