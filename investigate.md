*Date: April 8, 2012*
*Author: Khai Nguyen*

First, we need to implement our autoformat to control the visualization.

Initial lead is the demo "formatting.html" under "demo/" of original package.
Basically, the demo is to show autoformat the selected text.
The function call is "autoFormatRange" on object editor return by initialization.

Code Mirror has an autoformat plugin call "formatting.js" located at "/lib/codemirror/lib/util/"
Apparently, "autoFormatRange" function is defined like this

> `CodeMirror.defineExtension("autoFormatRange", function (from, to) {`

Meaning:
This means CodeMirror needs to be loaded before the plugins. It shows
the order of loading scripts inside "formatting.html" demo.

Furthermore, inside the function call, there is this line

> `this.getModeExt().autoFormatLineBreaks(this.getValue(), absStart, absEnd);`

Meaning:
+ "this" refers to editor object.
+ You also have a mode extension i.e. a plugin on a specific mode (or language). to get it

> `getModeExt()`

Overall, the mechanism of formatting is esssentially break down code
to line and add indentation to block.

A mode extension defines like the following i.e. a dictionary.

> `CodeMirror.modeExtensions["javascript"] = {`
>  `commentStart: "/*",`

Meaning:
+ This implies that defining a new mode will replaces the old mode.

