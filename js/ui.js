/*jslint browser: true, regexp: true */
/*global jQuery, $, IEditor, Format */

var ieditor = new IEditor("editor","terminal", "system");

//Added scrollbar
// Preloading the images used for the slider handle
function createSlider(cachedObj, size) {
    var startIndex;
    cachedObj.slider({
        step: 1,
        max: size,
        change: function(event, ui) {
            var curIndex = ui.value,
            snapshotSize = Format.getSnapshotSize(),
            sizeOfslider = cachedObj.slider('value');

            if (curIndex > startIndex) {
                // call forward
                // console.log(curIndex);
                // console.log('forwarding');
                Format.forward(curIndex);
            } else if(curIndex < startIndex) {
                // call rewrind
                // console.log(curIndex);
                // console.log('rewinding');
                Format.rewind(curIndex);
            }
        },
        start: function(event, ui) {
            startIndex = ui.value;
            // cachedObj.slider('value', Format.getSnapshotSize());
        }

    });
    cachedObj.slider('value', size);
}
$(document).ready(function(){
    (function(){
        var cachedObj = $('#slider');
        // startIndex = 100;
        createSlider(cachedObj, 1);

        // running debuging
        $("#debug").click(function(e){
            e.preventDefault();
            // Get the error
            var error = ieditor.error(),
            consoleCheck = $("#console");
            //console.log(error);
            if (error === "") {
                error = "Great! Successfully execute the script.";
            }
            consoleCheck.children('span').remove();
            consoleCheck.append("<span>"+error+"<\/span>");
            consoleCheck.modal();
        });

        // // make the height to full size
        // var winHeight = $(window).height();
        // $('.CodeMirror').height(winHeight - 60);
    })();
});
