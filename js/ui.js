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
                Format.forward(curIndex);
                } else if(curIndex < startIndex) {
                // call rewrind
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

        // push the console to the end of the page
        var cachedConsole = $('#console');
        cachedConsole.css({'position': 'fixed', 'bottom': 0, 'left': 0, 'z-index': 100});
        // using waypoint to find out that div and change it css to fixed
        var controlbarDiv = $('#controlbar');
        controlbarDiv.waypoint(function(event, direction){
            if (direction === 'down') {
                controlbarDiv.css({'position': 'fixed', 'top': 5, 'z-index': 10});
            } else {
                controlbarDiv.css({'position': ''});
            }
        });
        // running debuging
        $("#debug").click(function(e){
            e.preventDefault();
            // Get the error
            var error = ieditor.error(),
            consoleCheck = $("#console");
            if (error === "") {
                error = "Great! Successfully execute the script.";
            }
            consoleCheck.children('span').remove();
            consoleCheck.append("<span>"+error+"<\/span>").show().addClass('well');
        });
        $("#close-debug").click(function(e){
            e.preventDefault();
            $(this).parent().hide().removeClass('well').children('span').remove();
        });

        // // make the height to full size
        // var winHeight = $(window).height();
        // $('.CodeMirror').height(winHeight - 120);
    })();
});