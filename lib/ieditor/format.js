(function(exports){

function align(editorValue, terminal, snapshot) {
    terminal.setValue(editorValue);
    // console.log(snapshot.length);
    // console.log(snapshot[snapshot.length - 1]);
    // replace the latest code
    console.log(snapshot);
    for (var i = 0; i < snapshot.length; i += 1) {
        var replaceText = snapshot[i].replace.toString(),
            range = normalizeRange(snapshot[i].range),
            from = range.from,
            to = range.to;
        terminal.replaceRange(replaceText, from, to);
    }
    // terminal.replaceRange("s", {"line": 4, "ch": 1}, {"line": 4, "ch": 5});
    // terminal.replaceRange("h", {"line": 3, "ch": 2}, {"line": 3, "ch": 4});

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
