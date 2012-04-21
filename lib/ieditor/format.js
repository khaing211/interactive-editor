(function(exports){

function align(editorValue, terminal, snapshot) {
    // Save and update the objet into the jQuery data
    $('body').data('editorValue', editorValue);
    $('body').data('terminal', terminal);
    $('body').data('snapshot', snapshot);

    // Reset the srollbar to value 100
    var cachedSlider = $('#slider');
    if (cachedSlider !== undefined) {
        cachedSlider.slider('value', 100);
        if (snapshot.length === 0) {
            cachedSlider.slider('disable');
            console.log(snapshot);
        } else {
            cachedSlider.slider('enable');
        }
    }

    // console.log(snapshot.length);
    // console.log(snapshot[snapshot.length - 1]);
    // replace the latest code
    // console.log(snapshot);
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
