# End-User
Open index.html and it just works :D. Don't read anymore if you are not a developer.

# Directory Structure
+ lib/ contrains external/internal libraries. Each libraries has their own directory to preserve their own structure  
    - codemirror: contains essential directories of [code mirror](http://codemirror.net/)
        * keymap: plugins to map hotkey to action like vim and emacs
        * lib: codemirror core
        * mode: plugins to handle different language (each directory has js and example)
        * theme: plugins to change theme of editor
    - pegjs: contains [PEG](http://pegjs.majda.cz/). PEG is a parser generator 
    - parser: contains parsers produced by PEG
    - ieditor: contains interactive editor code. Look at header of each file for description.
+ test/ contains all tests
+ index.html: your editor

# Code Rule
+ tab: 4 spaces
