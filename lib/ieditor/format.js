(function(exports){

function align(editorValue, terminal, snapshot) {
    //console.log(snapshot);
    console.log(editorValue);
    for (var i = 0; i < snapshot.length; i += 1) {
        terminal.setValue(editorValue);
        var replaceText = snapshot[i].replace;
        if (typeof(replaceText) === "function") {
            replaceText = "function()";
        } else if (typeof(replaceText) === "object") {
            replaceText = JSON.stringify(replaceText);
        } else {
            // if the replacement text is a string
            replaceText = replaceText.toString();
        }
        terminal.replaceRange(replaceText, snapshot[i].range.from, snapshot[i].range.to);
    }

}

exports.align = align;

}(typeof exports === 'undefined'? Format = {}: exports));
