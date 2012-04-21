(function(exports){

    var savedSnapshot, savedEditorValue, savedTerminal;

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

function align(editorValue,  snapshot) {
    // Save and update the objet into the jQuery data

    savedEditorValue = editorValue;
    savedSnapshot = snapshot;
    // sort snapshot in order
    snapshot.sort(function(edit1, edit2) {
        if (edit1.range.to.line < edit2.range.from.line) return -1;
        else if (edit1.range.to.line == edit2.range.from.line) {
            if (edit1.range.to.ch < edit2.range.from.ch) {
                return -1;
            }
            else {
                return 1;
            } 
        }
        else {
            return 1;
        }
    });
    
    var line = 0, ch = 0, j = 0, i = 0, fragments = [];
    // i = index for snapshot, j = index for editorValue
	var replaceText, fromLine, fromCh, toLine, toCh;
	if (snapshot.length > 0) {
	    replaceText = normalizeObject(snapshot[i].replace);
		fromLine = snapshot[i].range.from.line;
		fromCh = snapshot[i].range.from.ch;
		toLine = snapshot[i].range.to.line;
		toCh = snapshot[i].range.to.ch;
	}
	
    while (j < editorValue.length) {
        if (editorValue[j] == '\n') {
            // reset count
            line += 1;
            ch = 0;
        }
        else {
            if (line == fromLine && ch == fromCh) {
                fragments.push(editorValue.substring(0,j));
                editorValue = editorValue.substring(j);
                j = 0; // reset j counter, because editorvalue change
            }
            if (line == toLine && ch == toCh) {
                fragments.push(replaceText);
                editorValue = editorValue.substring(j);
                j = 0; // reset j counter, because editorValue change

                // Get next edit
                i += 1;
                if (i >= snapshot.length) {
                    // we ran out of snapshot object. QUIT !!! LOOPPING
                    break;
                }
                replaceText = normalizeObject(snapshot[i].replace);
                fromLine = snapshot[i].range.from.line;
                fromCh = snapshot[i].range.from.ch;
                toLine = snapshot[i].range.to.line;
                toCh = snapshot[i].range.to.ch;
            }

            // increase ch count
            ++ch;
        }
        ++j;
    }

    editorValue = fragments.join('') + editorValue;
    savedTerminal.setValue(editorValue);
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
    var snapshot = savedSnapshot,
        editorValue = savedEditorValue,
        terminal = savedTerminal,
        flag = true;

    if(snapshot === undefined) {
        flag = false;
    } else {
        snapshot = snapshot.slice(0, x);
    }
    if ( flag && snapshot.length !== 0) {
        // sort snapshot in order
        snapshot.sort(function(edit1, edit2) {
            if (edit1.range.to.line < edit2.range.from.line) return -1;
            else if (edit1.range.to.line == edit2.range.from.line) {
                if (edit1.range.to.ch < edit2.range.from.ch) {
                    return -1;
                }
                else {
                    return 1;
                } 
            }
            else {
                return 1;
            }
        });

        var line = 0, ch = 0, j = 0, i = 0, fragments = [];
        // i = index for snapshot, j = index for editorValue
        var replaceText = normalizeObject(snapshot[i].replace);
        var fromLine = snapshot[i].range.from.line;
        var fromCh = snapshot[i].range.from.ch;
        var toLine = snapshot[i].range.to.line;
        var toCh = snapshot[i].range.to.ch;

        while (j < editorValue.length) {
            if (editorValue[j] == '\n') {
                // reset count
                line += 1;
                ch = 0;
            }
            else {
                if (line == fromLine && ch == fromCh) {
                    fragments.push(editorValue.substring(0,j));
                    editorValue = editorValue.substring(j);
                    j = 0; // reset j counter, because editorvalue change
                }
                if (line == toLine && ch == toCh) {
                    fragments.push(replaceText);
                    editorValue = editorValue.substring(j);
                    j = 0; // reset j counter, because editorValue change

                    // Get next edit
                    i += 1;
                    if (i >= snapshot.length) {
                        // we ran out of snapshot object. QUIT !!! LOOPPING
                        break;
                    }
                    replaceText = normalizeObject(snapshot[i].replace);
                    fromLine = snapshot[i].range.from.line;
                    fromCh = snapshot[i].range.from.ch;
                    toLine = snapshot[i].range.to.line;
                    toCh = snapshot[i].range.to.ch;
                }

                // increase ch count
                ++ch;
            }
            ++j;
        }

        editorValue = fragments.join('') + editorValue;
        terminal.setValue(editorValue);
    } else {
        // make it to the original text
        editorValue = savedEditorValue;
        terminal.setValue(editorValue);
    }
}

function forward(x) {
    console.log("calling forward");
    rewind(x);
}

exports.align = align;
exports.init = init;
exports.getSnapshotSize = getSnapshotSize;
exports.rewind = rewind;
exports.forward = forward;

}(typeof exports === 'undefined'? Format = {}: exports));
