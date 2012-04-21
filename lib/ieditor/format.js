(function(exports){

function align(editorValue, terminal, snapshot) {
    //console.log(snapshot);
    console.log(editorValue);
    for (var i = 0; i < snapshot.length; i += 1) {
        terminal.setValue(editorValue);
        var replaceText = snapshot[i].replace;
        console.log(typeof(replaceText));
        if (typeof(replaceText) === "function") {
            replaceText = "function()";
        } else if (typeof(replaceText) === "object") {
            replaceText = JSON.stringify(replaceText);
        } else {
            // if the replacement text is a string
            replaceText = replaceText.toString();
        }
        var range = normalizeRange(snapshot[i].range),
            from = range.from,
            to = range.to;
        terminal.replaceRange(replaceText, from, to);
    }

}

function normalizeRange(range) {
    return {
        'from': {
            "line": range.start.line - 1,
            "ch": range.start.column
        },
        'to': {
            "line": range.end.line - 1,
            "ch": range.end.column
        }
    };
}

exports.align = align;

}(typeof exports === 'undefined'? Format = {}: exports));
