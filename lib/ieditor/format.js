(function(exports){

    var savedSnapshot, savedEditorValue, savedTerminal, dag, cachedSlider;

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

    function getAllValidEdits(x) {
        var validEdits = [];
        var i = 0;
        var nextEdit;
        while ((nextEdit = getNextValidEdit(i, x)) !== undefined) {
            validEdits.push(nextEdit);
            i = nextEdit.i+1;
        }

        // sort the order
        validEdits.sort(function(edit1, edit2) {
            if(edit1.toLine < edit2.fromLine)
                return -1;
            else if(edit1.toLine == edit2.fromLine) {
                if(edit1.toCh < edit2.fromCh) {
                    return -1;
                } else {
                    return 1;
                }
            } else {
                return 1;
            }
        });

        return validEdits;
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
        // i = index for edits, j = index for editorValue
        var edits = getAllValidEdits(x);
        var editorValue = savedEditorValue;
        //console.log(edits);
        //console.log(x);
        while (j < editorValue.length) {
            if (editorValue[j] == '\n') {
                // reset count
                line += 1;
                ch = 0;
            }
            else {
                if (line == edits[i].fromLine && ch == edits[i].fromCh) {
                    fragments.push(editorValue.substring(0,j));
                    editorValue = editorValue.substring(j);
                    j = 0; // reset j counter, because editorvalue change
                }
                if (line == edits[i].toLine && ch == edits[i].toCh) {
                    fragments.push(edits[i].text);
                    editorValue = editorValue.substring(j);
                    j = 0; // reset j counter, because editorValue change
                    // Get next edit
                    i += 1;
                    if (i >= edits.length) break;
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
        // save variable
        savedEditorValue = editorValue;
        savedSnapshot = snapshot;

        // var cachedSlider = $('#slider');
        if (cachedSlider === undefined) {
            cachedSlider = $("#slider");
        }

        if (cachedSlider !== undefined) {
            //cachedSlider.slider('value', snapshot.length);
            if (snapshot.length === 0) {
                // cachedSlider.slider('disable');
                // console.log(snapshot);
                cachedSlider.slider({'max': 1});
                cachedSlider.slider({'value': 1});
            } else {
                // console.log("snapshot length: " + snapshot.length);
                cachedSlider.slider({'max': snapshot.length});
                cachedSlider.slider({'value': snapshot.length});
                // console.log("slider length: " + cachedSlider.slider('value'));
            }
        }

        if (snapshot.length === 0) {
            savedTerminal.setValue(editorValue);
            return;
        }

        dag = Tracer.buildDAG(snapshot);
        //console.log(savedSnapshot);
        //console.log(dag);
        showUpTo(snapshot.length-1);
    }

    function normalizeObject(replace) {

        if (replace === undefined) {
            return "undefined";
        }
        else if (typeof(replace) === "function") {
            return "(function())";
        } else if (typeof(replace) === "object") {
            return JSON.stringify(replace);
        } else if (typeof(replace) === "string") {
            return '"' + replace + '"';
        }
        else {
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
