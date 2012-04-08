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
    - parsers: contains parsers produced by PEG
    - ieditor: contains interactive editor code. Look at header of each file for description.
+ ast/ contains grammar of any language written in PEG syntax in order for PEG to produce a parser
    - javascript.pegjs: javascript grammar for example
+ index.html: your editor
+ index-development.html: development-version of the editor, see Development Setup for explaination

# Development Setup
## PEG Setup
### Explaination
[PEG Document](http://pegjs.majda.cz/documentation) shows that there is three interfaces to use, 
but we will take advantage of two interface: commandline and javascript api.

We will use javascript api to develop the the editor, because it allows to PEG to compile a grammar
to a parser on-the-fly. This allows developer to see their changes to ast instanteously. We
won't take this approach for the end-product, because compile on-the-fly is slow. We can pre-compute
to save time by using commandline interface.

Now this is the difference between index.html and index-development.html. In index-development.html,
we either do ajax or iframe to get .pegjs files, and feed it to PEG which is in lib/pegjs to produce a parser. 
In index.html, we will just load compile parser from parser directory.

### Commandline Interface
From PEG documentation, you just 

> npm install pegjs

For me, it installs to ~/bin rather than /usr/bin/. I don't know why...

### Example for javascript. Assume current directory is PROJECT HOME
> path/to/pegjs ast/javascript.pegjs parsers/javascript.js


# Code Rule
+ tab: 4 spaces
