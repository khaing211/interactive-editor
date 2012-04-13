(function(){

var root = this;
var Format;
Format = root.Format = {};

Format.init = function(editors) {
    this.terminal = editors.terminal;
    this.editor = editors.editor;
}

Format.alignment = function() {
    console.log(this.editor.getValue());
}


})();
