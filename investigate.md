*Date: April 8, 2012*
*Author: Khai Nguyen*
* * *

First, we need to implement our autoformat to control the visualization.

Initial lead is the demo "formatting.html" under "demo/" of original package.
Basically, the demo is to show autoformat the selected text.
The function call is "autoFormatRange" on object editor return by initialization.

Code Mirror has an autoformat plugin call "formatting.js" located at "/lib/codemirror/lib/util/"
Apparently, "autoFormatRange" function is defined like this

`CodeMirror.defineExtension("autoFormatRange", function (from, to) {`

Meaning:
This means CodeMirror needs to be loaded before the plugins. It shows
the order of loading scripts inside "formatting.html" demo.

Furthermore, inside the function call, there is this line

`this.getModeExt().autoFormatLineBreaks(this.getValue(), absStart, absEnd);`

Meaning:

+ "this" refers to editor object.
+ You also have a mode extension i.e. a plugin on a specific mode (or language). to get it

`getModeExt()`

Overall, the mechanism of formatting is esssentially break down code
to line and add indentation to block.

A mode extension defines like the following i.e. a dictionary.

`CodeMirror.modeExtensions["javascript"] = {`
`commentStart: "/*",`

Meaning:
+ This implies that defining a new mode will replaces the old mode.

* * *
* * *

*Date: April 10, 2012*
*Author: Khai Nguyen*

Documentation onChange
`onChange (function)`
> When given, this function will be called every time the content of the editor is changed. 
> It will be given the editor instance as first argument, and an `{from, to, text, next}` object 
> containing information about the changes that occurred as second argument. from and to are the 
> positions (in the pre-change coordinate system) where the change started and ended (for example, 
> it might be `{ch:0, line:18}` if the position is at the beginning of line #19). text is an array of 
> strings representing the text that replaced the changed range (split by line). If multiple changes 
> happened during a single operation, the object will have a next property pointing to another change 
> object (which may point to another, etc).

Translation:
+ The second parameters could be called "changes" i.e. a linked list of change
+ from, to are of type {ch, line} with ch,line are 0-based and in pre-change coordinate system
+ ch is position of character in that line.
+ text are array of string that splits by line i.e. more than one element = multiple lines => line changes.

Experiment:
+ if there is no next change, there is no field "next". Not that field "next" is undefined.
+ insertion: from,to are the same and points to place of insertion. text is an array of insertion. For example: aba => aaba would produce from: {ch:1, line:0} to: {ch: 1, line: 0} 
+ replacement: from,to are the range of replacement. text is the replacement
+ deletion: is same as replacement but with "" for text.

After experiment:
+ from, to could be thought as exclusive range i.e. [from, to)
+ when from, to are equals, it mean empty range.
