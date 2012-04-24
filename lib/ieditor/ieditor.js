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
        var error;
        function getError() {
            if (error === undefined) {
                return "";
            } else {
                return error;
            }
        }



        function parse() {
            // clear out timer id
            timerId = undefined;
            try {
                var cachedEditorValue = editor.getValue();
                var tree = esprima.parse(cachedEditorValue, esprima_options);
                var snapshot = Tracer.trace(tree);
                Format.align(cachedEditorValue, snapshot);
                // signal that the terminal just align
                error = "";
            } catch (e) {
                error = e;
            }
        }
        
        function editorOnChange(editor, changes) {

            do {
                // Put into terminal
                terminal.replaceRange(Util.merge(changes.text, '\n'), changes.from, changes.to);                
            } while ((changes = changes.next) !== undefined);
			if(timerId !== undefined) {
				window.clearTimeout(timerId);
			}

			// create new timer
			timerId = window.setTimeout(parse, parserTimeout); 

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
            onScroll: editorOnScroll,
            extraKeys: {"Ctrl-Space": function(cm) {
                CodeMirror.simpleHint(cm, CodeMirror.javascriptHint);}
            }
        });

        var terminal = CodeMirror.fromTextArea(terminalTextArea, {
            mode: "javascript",
            readOnly: true,
            onFocus: terminalOnFocus,
            onBlur: terminalOnBlur,
            onScroll: terminalOnScroll
        });
        
        Format.init(terminal);
        
        return {editor: editor, terminal: terminal, error: getError};
    }

    return IEditor;
})();
