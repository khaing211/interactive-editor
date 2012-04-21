(function(exports){

    var savedSnapshot, savedEditorValue, savedTerminal, dag;

    function init(terminal) {
        savedTerminal = terminal;
    }

    function getSnapshotSize() {
        if (savedSnapshot === undefined) {
            return 0;
        } else {
            return savedSnapshot.length;
        }
    }
    
    function getNextValidEdit(from, to) {
    	if (savedSnapshot === undefined || dag === undefined) {
			return undefined;    		
    	}
    		
		for (; from < savedSnapshot.length && from <= to; ++from) {
			// if dependency is out of range
			if (dag[from] > to || from >= dag[from]) {
				var text = normalizeObject(savedSnapshot[from].replace);
		    	var fromLine = savedSnapshot[from].range.from.line;
		    	var fromCh = savedSnapshot[from].range.from.ch;
		    	var toLine = savedSnapshot[from].range.to.line;
		    	var toCh = savedSnapshot[from].range.to.ch;
		    	return {text: text, fromLine: fromLine, toLine: toLine, fromCh: fromCh, toCh: toCh, i: from};
	    	}
	    	
		}
		   	
    	return undefined;
    }
    
    function showUpTo(x) {
    	if (savedSnapshot === undefined || 
    		savedEditorValue === undefined ||
    		savedTerminal === undefined ||
    		dag === undefined) 
		{
			return;
		}
		
		// out of range, do nothing
    	if (x >= savedSnapshot.length && x < 0) {
    		return;
    	}
        		
        var line = 0, ch = 0, j = 0, i = 0, fragments = [];
        // i = index for snapshot, j = index for editorValue
        var nextEdit = getNextValidEdit(i, x);
    	var editorValue = savedEditorValue;
    	// always have a valid edit if there is at least one edit
    	i = nextEdit.i;
        while (j < editorValue.length && nextEdit !== undefined) {
            if (editorValue[j] == '\n') {
                // reset count
                line += 1;
                ch = 0;
            }
            else {
                if (line == nextEdit.fromLine && ch == nextEdit.fromCh) {
                    fragments.push(editorValue.substring(0,j));
                    editorValue = editorValue.substring(j);
                    j = 0; // reset j counter, because editorvalue change
                }
                if (line == nextEdit.toLine && ch == nextEdit.toCh) {
                    fragments.push(nextEdit.text);
                    editorValue = editorValue.substring(j);
                    j = 0; // reset j counter, because editorValue change
    
                    // Get next edit
                    i += 1;
                    nextEdit = getNextValidEdit(i, x);
                    if (nextEdit === undefined)
                    	break;
                    i = nextEdit.i;
                }
                // increase ch count
                ++ch;
            }
            ++j;
        }
    
        editorValue = fragments.join('') + editorValue;
        savedTerminal.setValue(editorValue);
    	
    }

    function align(editorValue,  snapshot) {
        if (snapshot.length === 0) {
            return;
        }
        
        // save variable
        savedEditorValue = editorValue;
        savedSnapshot = snapshot;
		dag = Tracer.buildDAG(snapshot);
		showUpTo(snapshot.length-1);
    }

    function normalizeObject(replace) {
        if (typeof(replace) === "function") {
            return "function()";
        } else if (typeof(replace) === "object") {
            return JSON.stringify(replace);
        } else {
            // if the replacement text is a string
            return replace.toString();
        }
    }

    function rewind(x) {
    	showUpTo(x);
    }
    
    function forward(x) {
		showUpTo(x);
    }

    exports.align = align;
    exports.init = init;
    exports.getSnapshotSize = getSnapshotSize;
    exports.rewind = rewind;
    exports.forward = forward;

}(typeof exports === 'undefined'? Format = {}: exports));
