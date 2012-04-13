// TODO: implement the alignment of the terimal
(function(){

  var root =this;

  var previousFormat = root.Format;

  var Format;

  if (typeof exports !== 'undefined') {
    Format = exports;
  } else {
    Format = root.Format = {};
  }

  Format.init = function(editors, snapshots) {
    this.t_editor = editors.terminal;
    this.e_editor = editors.editor;
  };

  Format.alignment = function() {
    console.log(this.t_editor);
    console.log(this.e_editor);
  };

}).call(this);
