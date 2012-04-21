/*
Copyright (C) 2012 Ariya Hidayat <ariya.hidayat@gmail.com>
Copyright (C) 2012 Mathias Bynens <mathias@qiwi.be>
Copyright (C) 2012 Joost-Wim Boekesteijn <joost-wim@boekesteijn.nl>
Copyright (C) 2012 Kris Kowal <kris.kowal@cixar.com>
Copyright (C) 2012 Yusuke Suzuki <utatane.tea@gmail.com>
Copyright (C) 2012 Arpad Borsos <arpad.borsos@googlemail.com>
Copyright (C) 2011 Ariya Hidayat <ariya.hidayat@gmail.com>

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright
notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright
notice, this list of conditions and the following disclaimer in the
documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

( function(exports) {
    'use strict';
    
    var Syntax, Precedence, BinaryPrecedence;
    Syntax = {
        AssignmentExpression : 'AssignmentExpression',
        ArrayExpression : 'ArrayExpression',
        BlockStatement : 'BlockStatement',
        BinaryExpression : 'BinaryExpression',
        BreakStatement : 'BreakStatement',
        CallExpression : 'CallExpression',
        CatchClause : 'CatchClause',
        ConditionalExpression : 'ConditionalExpression',
        ContinueStatement : 'ContinueStatement',
        DoWhileStatement : 'DoWhileStatement',
        DebuggerStatement : 'DebuggerStatement',
        EmptyStatement : 'EmptyStatement',
        ExpressionStatement : 'ExpressionStatement',
        ForStatement : 'ForStatement',
        ForInStatement : 'ForInStatement',
        FunctionDeclaration : 'FunctionDeclaration',
        FunctionExpression : 'FunctionExpression',
        Identifier : 'Identifier',
        IfStatement : 'IfStatement',
        Literal : 'Literal',
        LabeledStatement : 'LabeledStatement',
        LogicalExpression : 'LogicalExpression',
        MemberExpression : 'MemberExpression',
        NewExpression : 'NewExpression',
        ObjectExpression : 'ObjectExpression',
        Program : 'Program',
        Property : 'Property',
        ReturnStatement : 'ReturnStatement',
        SequenceExpression : 'SequenceExpression',
        SwitchStatement : 'SwitchStatement',
        SwitchCase : 'SwitchCase',
        ThisExpression : 'ThisExpression',
        ThrowStatement : 'ThrowStatement',
        TryStatement : 'TryStatement',
        UnaryExpression : 'UnaryExpression',
        UpdateExpression : 'UpdateExpression',
        VariableDeclaration : 'VariableDeclaration',
        VariableDeclarator : 'VariableDeclarator',
        WhileStatement : 'WhileStatement',
        WithStatement : 'WithStatement'
    };
    Precedence = {
        Sequence : 0,
        Assignment : 1,
        Conditional : 2,
        LogicalOR : 3,
        LogicalAND : 4,
        LogicalXOR : 5,
        BitwiseOR : 6,
        BitwiseAND : 7,
        Equality : 8,
        Relational : 9,
        BitwiseSHIFT : 10,
        Additive : 11,
        Multiplicative : 12,
        Unary : 13,
        Postfix : 14,
        Call : 15,
        New : 16,
        Member : 17,
        Primary : 18
    };  
    BinaryPrecedence = {
        '||' : Precedence.LogicalOR,
        '&&' : Precedence.LogicalAND,
        '^' : Precedence.LogicalXOR,
        '|' : Precedence.BitwiseOR,
        '&' : Precedence.BitwiseAND,
        '==' : Precedence.Equality,
        '!=' : Precedence.Equality,
        '===' : Precedence.Equality,
        '!==' : Precedence.Equality,
        '<' : Precedence.Relational,
        '>' : Precedence.Relational,
        '<=' : Precedence.Relational,
        '>=' : Precedence.Relational,
        'in' : Precedence.Relational,
        'instanceof' : Precedence.Relational,
        '<<' : Precedence.BitwiseSHIFT,
        '>>' : Precedence.BitwiseSHIFT,
        '>>>' : Precedence.BitwiseSHIFT,
        '+' : Precedence.Additive,
        '-' : Precedence.Additive,
        '*' : Precedence.Multiplicative,
        '%' : Precedence.Multiplicative,
        '/' : Precedence.Multiplicative
    };
    

    // Global variable maintain the current spacing
    // recursive function call -> save, padding indent, restore the base afterward
    var namespace = '_', tmp = 0;

    function getNextTmp() {
        var previousTmp = tmp++;
        return "tmpvar"+previousTmp;
    }
    
    function push(range, replace) {
        return 'System.push(' + JSON.stringify(range) + ', ' + replace + ');';
    }    

    function unicodeEscape(ch) {
        var result, i;
        result = ch.charCodeAt(0).toString(16);
        for( i = result.length; i < 4; i += 1) {
            result = '0' + result;
        }
        return '\\u' + result;
    }

    function stringToArray(str) {
        var length = str.length, result = [], i;
        for( i = 0; i < length; i += 1) {
            result[i] = str.charAt(i);
        }
        return result;
    }

    function escapeString(str) {
        var result = '', i, len, ch;

        if( typeof str[0] === 'undefined') {
            str = stringToArray(str);
        }

        for( i = 0, len = str.length; i < len; i += 1) {
            ch = str[i];
            if('\'\\\b\f\n\r\t'.indexOf(ch) >= 0) {
                result += '\\';
                switch (ch) {
                    case '\'':
                        result += '\'';
                        break;
                    case '\\':
                        result += '\\';
                        break;
                    case '\b':
                        result += 'b';
                        break;
                    case '\f':
                        result += 'f';
                        break;
                    case '\n':
                        result += 'n';
                        break;
                    case '\r':
                        result += 'r';
                        break;
                    case '\t':
                        result += 't';
                        break;
                }
            } else if(ch < ' ' || ch.charCodeAt(0) >= 0x80) {
                result += unicodeEscape(ch);
            } else {
                result += ch;
            }
        }

        return '\'' + result + '\'';
    }

    function maybeBlock(stmt, attach) {
        // This function handle the case of block
        // block => empty, one stmt, a block of statement
        // For in case of loop, attach = instruction to run before or after the block
        var result;

        if(stmt.type === Syntax.BlockStatement) {            
            return generateStatement(stmt, attach);
        }

        if(stmt.type === Syntax.EmptyStatement) {
            result = ' {';
            if (attach) {
                if (attach.before) {
                    result += attach.before;    
                }
                if (attach.after) {
                    result += attach.after;
                }                          
            }
            result += '}';
        } else {
            result = ' {';
            if (attach && attach.before) {
                result += attach.before;    
            } 
            result += generateStatement(stmt);
            if (attach && attach.after) {
                result += attach.after;
            }                                      
            result += '}';
        }

        return result;
    }

    function generateFunctionBody(node) {
        var result, i, len;
        result = '(';
        for( i = 0, len = node.params.length; i < len; i += 1) {
            result += node.params[i].name;
            if((i + 1) < len) {
                result += ', ';
            }
        }
        return result + ')' + maybeBlock(node.body);
    }

    function ExprVisitor() {
        this.code = [];
    }
    
    ExprVisitor.prototype.reset = function() {
        this.code = [];
    }
    
    // Translate expression to statement by packaging into anonymous function
    ExprVisitor.prototype.generate = function(expr, showValue) {
        var result, i, len, raw, tmpVar, visitor;

        if (showValue === undefined) {
            showValue = true;
        }
        
        switch (expr.type) {
            case Syntax.SequenceExpression:
                // According to http://javascript.comsci.us/syntax/expression/sequence.html
                // The value of SequenceExpression is the value of last expression
                // This become
                // (function(){ expr1, ..., exprn-1, return exprn;})()                                
                result = '(function(){';
                var visitor = new ExprVisitor();
                for( i = 0, len = expr.expressions.length; i < len; i += 1) {
                    tmpVar = visitor.generate(expr.expressions[i], i==len-1);                                        
                }
                result += Util.merge(visitor.code);                
                result += '})();';
                // show the value of entire sequence expression
                this.code.push(result);
                if (showValue) {                                   
                    this.code.push(push(expr.loc, tmpVar));
                } 
                return tmpVar;
                
            case Syntax.AssignmentExpression:
                // This become
                // (function(){left = right; return left;})
                result = '(function(){'
                visitor = new ExprVisitor();
                var retright = visitor.generate(expr.right);
                var retleft = visitor.generate(expr.left, false);
                result += Util.merge(visitor.code);
                result += retleft + expr.operator + retright + ';})();';
                // show the value of entire assignment expression
                this.code.push(result);                
                if (showValue) {  
                    this.code.push(push(expr.loc, retleft));
                }                
                return retleft;

            case Syntax.ConditionalExpression:
                // This become
                // (function() { if (expr.test) { return expr.consequent} else { return expr.alter}})();
                visitor = new ExprVisitor();
                var test = visitor.generate(expr.test);
                var testCode = Util.merge(visitor.code);
                visitor.reset(); // reused
                var consequent = visitor.generate(expr.consequent);
                var conCode = Util.merge(visitor.code);
                visitor.reset();                
                var alternate = visitor.generate(expr.alternate);
                var altCode = Util.merge(visitor.code);
                tmpVar = getNextTmp();
                result = 'var ' + tmpVar + '=(function(){' + testCode
                result += 'if(' + test + ') {' + conCode + 'return ' + consequent + ';}else{'
                result += altCode + 'return ' + alternate + ';}})();';
                // Show off the value
                this.code.push(result);
                if (showValue) {
                    this.code.push(push(expr.loc, tmpVar));
                }
                return tmpVar;

            case Syntax.LogicalExpression:
            case Syntax.BinaryExpression:
                visitor = new ExprVisitor();
                var left = visitor.generate(expr.left);
                var right = visitor.generate(expr.right);
                tmpVar = getNextTmp();
                result = 'var ' + tmpVar + ' = (function(){' + Util.merge(visitor.code);
                result += 'return ' + left + ' ' + expr.operator + ' ' + right + ';})();';
                // Show off the value
                this.code.push(result);                
                if (showValue) {
                    this.code.push(push(expr.loc, tmpVar));
                }
                return tmpVar;

            case Syntax.CallExpression:
                tmpVar = getNextTmp();
                result = 'var ' + tmpVar + '=(function(){';
                visitor = new ExprVisitor();
                var args = '';
                for( i = 0, len = expr['arguments'].length; i < len; i += 1) {                    
                    //result += generateExpression(, Precedence.Assignment);
                    args += visitor.generate(expr['arguments'][i]);
                    if((i + 1) < len) {
                        args += ', ';
                    }
                }                
                var callee = visitor.generate(expr.callee);
                result += Util.merge(visitor.code);
                result += 'return ' + callee + '(' + args + ');})();';
                // Show off the value
                this.code.push(result);                
                if (showValue) {
                    this.code.push(push(expr.loc, tmpVar));
                }                
                return tmpVar;

            case Syntax.NewExpression:
                tmpVar = getNextTmp();
                result = 'var ' + tmpVar + '=(function(){';
                var visitor = new ExprVisitor();
                var args = '';
                for( i = 0, len = expr['arguments'].length; i < len; i += 1) {                    
                    //result += generateExpression(, Precedence.Assignment);
                    args += visitor.generate(expr['arguments'][i]);
                    if((i + 1) < len) {
                        args += ', ';
                    }
                }                
                var callee = visitor.generate(expr.callee);
                result += Util.merge(visitor.code);
                result += 'return new ' + callee + '(' + args + ');})();';
                // Show off the value
                this.code.push(result);                
                if (showValue) {
                    this.code.push(push(expr.loc, tmpVar));
                }                
                return tmpVar;
            
            case Syntax.MemberExpression:
                // NOTE you cannot do function or tmpVar, because it would not be correct. here...                
                var objectVar = this.generate(expr.object, false);                
                if(expr.computed) {
                    var propertyVar = this.generate(expr.property);
                    result = objectVar + '[' + propertyVar + ']';
                    return result;                    
                } else {
                    result = objectVar + '.' + expr.property.name;
                    return result;
                }

            case Syntax.UnaryExpression:
                visitor = new ExprVisitor();
                var arg = visitor.generate(expr.argument);                
                tmpVar = getNextTmp();
                result = 'var ' + tmpVar + '=(function(){';
                result += Util.merge(visitor.code);
                result += 'return ' + expr.operator + arg + ';})();'
                // Show off the value
                this.code.push(result);
                if (showValue) {
                    this.code.push(push(expr.loc, tmpVar));
                }                
                return tmpVar;
                
            case Syntax.UpdateExpression:
                visitor = new ExprVisitor();
                var arg = visitor.generate(expr.argument);                
                tmpVar = getNextTmp();
                result = 'var ' + tmpVar + '=(function(){';
                result += Util.merge(visitor.code);
                if (expr.prefix) {
                    result += 'return ' + expr.operator + arg + ';})();';
                }
                else {
                    result += 'return ' + arg + expr.operator + ';})();';
                }
                // Show off the value
                this.code.push(result);
                if (showValue) {
                    this.code.push(push(expr.loc, tmpVar));
                }                
                return tmpVar;
            
            case Syntax.FunctionExpression:
                result = 'function ';
                if(expr.id) {
                    result += expr.id.name;
                }
                result += generateFunctionBody(expr);
                return result;

            case Syntax.ArrayExpression:
                if(!expr.elements.length) {
                    return '[]';
                }
                result = '[';

                for( i = 0, len = expr.elements.length; i < len; i += 1) {
                    if(!expr.elements[i] && (i + 1) === len) {
                        result += ',';
                    } 
                    else {
                        result += this.generate(expr.elements[i]);
                    }
                    if((i + 1) < len) {
                        result += ',';
                    }
                }
                result += ']';
                return result;

            case Syntax.Property:
                if(expr.kind === 'get' || expr.kind === 'set') {
                    var keyVar = this.generate(expr.key);
                    result = expr.kind + ' ' + keyVar + generateFunctionBody(expr.value);
                } else {
                    var keyVar = this.generate(expr.key);
                    var valVar = this.generate(expr.value); 
                    result = keyVar + ':' + valVar;
                }
                break;

            case Syntax.ObjectExpression:
                if(!expr.properties.length) {
                    return '{}';
                }
                result = '{';
                for( i = 0, len = expr.properties.length; i < len; i += 1) {
                    result += this.generate(expr.properties[i]);
                    if((i + 1) < len) {
                        result += ',';
                    }
                }
                result += '}';
                return result;

            case Syntax.ThisExpression:
                return 'this';

            case Syntax.Identifier:
                // Show identifier value
                // This might be too much....
                if (showValue) {
                    this.code.push(push(expr.loc, expr.name));
                }
                return expr.name;

            case Syntax.Literal:
                if(expr.hasOwnProperty('raw') && parse) {
                    try {
                        raw = parse(expr.raw).body[0].expression;
                        if(raw.type === Syntax.Literal) {
                            if(raw.value === expr.value) {
                                return expr.raw;
                            }
                        }
                    } catch (e) {
                        // not use raw property
                    }
                }

                if(expr.value === null) {
                    return 'null';
                }

                if( typeof expr.value === 'string') {
                    return escapeString(expr.value);                    
                }

                if( typeof expr.value === 'number' && expr.value === Infinity) {
                    // Infinity is variable
                    return '1e+1000';
                }
                
                return expr.value.toString();

            default:
                break;
        }

        if(result === undefined) {
            throw new Error('Unknown expression type: ' + expr.type);
        }
        return result;        
    }

    
    // Translate expression to statement (default)/expr by packaging into anonymous function
    ExprVisitor.prototype.generateExpr = function(expr, showValue) {
        var result, i, len, raw, tmpVar, visitor;

        if (showValue === undefined) {
            showValue = true;
        }
        
        switch (expr.type) {
            case Syntax.SequenceExpression:
                // According to http://javascript.comsci.us/syntax/expression/sequence.html
                // The value of SequenceExpression is the value of last expression
                // This become
                // (function(){ expr1, ..., exprn-1, return exprn;})()                                
                result = '(function(){';
                var visitor = new ExprVisitor();
                for( i = 0, len = expr.expressions.length; i < len; i += 1) {
                    tmpVar = visitor.generate(expr.expressions[i], i==len-1);                                        
                }
                result += Util.merge(visitor.code);
                if (showValue) {                                   
                    result += push(expr.loc, tmpVar);
                }                 
                result += 'return ' + tmpVar + '})()';
                // show the value of entire sequence expression
                return result;
                
            case Syntax.AssignmentExpression:
                // This become
                // (function(){left = right; return left;})
                result = '(function(){'
                visitor = new ExprVisitor();
                var retright = visitor.generate(expr.right);
                var retleft = visitor.generate(expr.left);
                result += Util.merge(visitor.code);
                result += retleft + expr.operator + retright;
                if (showValue) {
                    result += push(expr.loc, retLeft);  
                }                
                result += 'return ' + retLeft + ';})()';
                return result;

            case Syntax.ConditionalExpression:
                // This become
                // (function() { if (expr.test) { return expr.consequent} else { return expr.alter}})();
                visitor = new ExprVisitor();
                var test = visitor.generate(expr.test);
                var testCode = Util.merge(visitor.code);
                visitor.reset(); // reused
                var consequent = visitor.generate(expr.consequent);
                var conCode = Util.merge(visitor.code);
                visitor.reset();                
                var alternate = visitor.generate(expr.alternate);
                var altCode = Util.merge(visitor.code);
                result = '(function(){' + testCode;
                result += 'if(' + test + ') {' + conCode; 
                if (showValue) {
                    result += push(expr.loc, consequent);
                }                
                result += 'return ' + consequent + ';}else{'
                result += altCode;
                if (showValue) {
                    result += push(expr.loc, alternate);
                }                
                result +='return ' + alternate + ';}})()';
                return result;

            case Syntax.LogicalExpression:
            case Syntax.BinaryExpression:
                visitor = new ExprVisitor();
                var left = visitor.generate(expr.left);
                var right = visitor.generate(expr.right);
                result = '(function(){' + Util.merge(visitor.code);
                tmpVar = getNextTmp();
                result += 'var ' + tmpVar + '=' + left + ' ' + expr.operator + ' ' + right + ';';
                if (showValue) {
                    result += push(expr.loc, tmpVar);
                }                
                result += 'return ' + tmpVar + ';})()';
                return result;

            case Syntax.CallExpression:
                tmpVar = getNextTmp();
                result = '(function(){';
                visitor = new ExprVisitor();
                var args = '';
                for( i = 0, len = expr['arguments'].length; i < len; i += 1) {
                    args += visitor.generate(expr['arguments'][i]);
                    if((i + 1) < len) {
                        args += ', ';
                    }
                }                
                var callee = visitor.generate(expr.callee);
                result += Util.merge(visitor.code);
                var tmpVar = getNextTmp();
                result += 'var ' + tmpVar + '=' + callee + '(' + args + ');';
                if (showValue) {
                    result += push(expr.loc, tmpVar);
                }                 
                result += 'return ' + tmpVar + ';})()';
                return result;

            case Syntax.NewExpression:                
                result = '(function(){';
                var visitor = new ExprVisitor();
                var args = '';
                for( i = 0, len = expr['arguments'].length; i < len; i += 1) {                    
                    //result += generateExpression(, Precedence.Assignment);
                    args += visitor.generate(expr['arguments'][i]);
                    if((i + 1) < len) {
                        args += ', ';
                    }
                }                
                var callee = visitor.generate(expr.callee);
                result += Util.merge(visitor.code);
                tmpVar = getNextTmp();
                result += 'var ' + tmpVar + '= new ' + callee + '(' + args + ');'; 
                if (showValue) {
                    result += push(expr.loc, tmpVar);
                }                 
                result += 'return ' + tmpVar + ';})()';
                return result;
            
            case Syntax.MemberExpression:
                // NOTE you cannot do function or tmpVar, because it would not be correct.                
                var objectVar = this.generate(expr.object, false);                
                if(expr.computed) {
                    var propertyVar = this.generate(expr.property);
                    result = objectVar + '[' + propertyVar + ']';
                    return result;                    
                } else {
                    result = objectVar + '.' + expr.property.name;
                    return result;
                }

            case Syntax.UnaryExpression:
                visitor = new ExprVisitor();
                var arg = visitor.generate(expr.argument);                
                result = '(function(){';
                result += Util.merge(visitor.code);
                tmpVar = getNextTmp();
                result += 'var ' + tmpVar + '=' + expr.operator + arg + ';';
                if (showValue) {
                    result += push(expr.loc, tmpVar);
                }                 
                result += 'return ' + tmpVar + ';})()'
                return result;
                
            case Syntax.UpdateExpression:
                visitor = new ExprVisitor();
                var arg = visitor.generate(expr.argument);                
                result = '(function(){';
                result += Util.merge(visitor.code);
                tmpVar = getNextTmp();
                if (expr.prefix) {
                    result += 'var ' + tmpVar + '=' + expr.operator + arg + ';';                                                        
                }
                else {
                    result += 'var ' + tmpVar + '=' + arg + expr.operator + ';';                    
                }
                if (showValue) {
                    result +=  push(expr.loc, tmpVar);
                }                
                result += 'return ' + tmpVar + ';})()';
                return result;
            
            case Syntax.FunctionExpression:
                result = 'function ';
                if(expr.id) {
                    result += expr.id.name;
                }
                result += generateFunctionBody(expr);
                return result;

            case Syntax.ArrayExpression:
                if(!expr.elements.length) {
                    return '[]';
                }
                result = '[';

                for( i = 0, len = expr.elements.length; i < len; i += 1) {
                    if(!expr.elements[i] && (i + 1) === len) {
                        result += ',';
                    } 
                    else {
                        result += this.generate(expr.elements[i]);
                    }
                    if((i + 1) < len) {
                        result += ',';
                    }
                }
                result += ']';
                return result;

            case Syntax.Property:
                if(expr.kind === 'get' || expr.kind === 'set') {
                    var keyVar = this.generate(expr.key);
                    result = expr.kind + ' ' + keyVar + generateFunctionBody(expr.value);
                } else {
                    var keyVar = this.generate(expr.key);
                    var valVar = this.generate(expr.value); 
                    result = keyVar + ':' + valVar;
                }
                break;

            case Syntax.ObjectExpression:
                if(!expr.properties.length) {
                    return '{}';
                }
                result = '{';
                for( i = 0, len = expr.properties.length; i < len; i += 1) {
                    result += this.generate(expr.properties[i]);
                    if((i + 1) < len) {
                        result += ',';
                    }
                }
                result += '}';
                return result;

            case Syntax.ThisExpression:
                return 'this';

            case Syntax.Identifier:
                // Show identifier value
                // This might be too much....
                result = '(function(){';
                if (showValue) {
                    result += push(expr.loc, expr.name);
                }
                result += 'return ' + expr.name + ';})()'; 
                return result;

            case Syntax.Literal:
                if(expr.hasOwnProperty('raw') && parse) {
                    try {
                        raw = parse(expr.raw).body[0].expression;
                        if(raw.type === Syntax.Literal) {
                            if(raw.value === expr.value) {
                                return expr.raw;
                            }
                        }
                    } catch (e) {
                        // not use raw property
                    }
                }

                if(expr.value === null) {
                    return 'null';
                }

                if( typeof expr.value === 'string') {
                    return escapeString(expr.value);                    
                }

                if( typeof expr.value === 'number' && expr.value === Infinity) {
                    // Infinity is variable
                    return '1e+1000';
                }
                
                return expr.value.toString();

            default:
                break;
        }

        if(result === undefined) {
            throw new Error('Unknown expression type: ' + expr.type);
        }
        return result;        
    }


    function generateStatement(stmt, attach) {
        var i, len, result;

        switch (stmt.type) {
            case Syntax.BlockStatement:
                result = '{';
                if (attach && attach.before) {
                    result += attach.before;
                }
                for( i = 0, len = stmt.body.length; i < len; i += 1) {                    
                    result += generateStatement(stmt.body[i]);
                }
                if (attach && attach.after) {
                    result += attach.after;
                }
                result += '}';
                return result;

            case Syntax.BreakStatement:
                if(stmt.label) {
                    result = 'break ' + stmt.label.name + ';';
                } else {                    
                    result = 'break;';
                }
                return result;

            case Syntax.ContinueStatement:
                if(stmt.label) {
                    result = 'continue ' + stmt.label.name + ';';
                } else {
                    result = 'continue;';
                }
                return result;

            case Syntax.DoWhileStatement:
                var visitor = new ExprVisitor();                
                var tmpVar = visitor.generate(stmt.test);                
                return 'do' + maybeBlock(stmt.body, {after: Util.merge(visitor.code)}) + 'while(' + tmpVar + ');';

            case Syntax.CatchClause:
                if (stmt.param) {               
                    var visitor = new ExprVisitor();                
                    var tmpVar = visitor.generate(stmt.param);
                    result = 'catch(' + tmpVar + ')';
                }
                else {
                    result = 'catch()';                    
                }
                return result + maybeBlock(stmt.body, {before: Util.merge(visitor.code)});

            case Syntax.DebuggerStatement:
                return 'debugger;';

            case Syntax.EmptyStatement:
                return ';'

            case Syntax.ExpressionStatement:
                var visitor = new ExprVisitor();                
                visitor.generate(stmt.expression, false);
                result = Util.merge(visitor.code);                                
                return result;

            case Syntax.VariableDeclarator:            
                console.log("This should not never reach.");
                console.log(stmt);
                return ''; // silent error

            case Syntax.VariableDeclaration:
                // Make a new declaration every line => ;
                result = '';
                var visitor = new ExprVisitor();                    
                for( i = 0, len = stmt.declarations.length; i < len; i += 1) {                    
                    var newStmt = stmt.declarations[i];
                    
                    if(newStmt.init) {
                        var tmpVar = visitor.generate(newStmt.init);                        
                        result += Util.merge(visitor.code);
                        result += 'var ' + newStmt.id.name + '=' + tmpVar;
                        visitor.reset(); // clear out code stack to reuse visitor
                    } else {
                        result += 'var ' + newStmt.id.name;
                    }
                                        
                    result += ';';                    
                }                
                return result;

            case Syntax.ThrowStatement:
                var visitor = new ExprVisitor();                
                var tmpVar = visitor.generate(stmt.argument);                            
                return Util.merge(visitor.code) + 'throw ' + tmpVar + ';';

            case Syntax.TryStatement:
                result = 'try' + maybeBlock(stmt.block);
                for( i = 0, len = stmt.handlers.length; i < len; i += 1) {
                    result += generateStatement(stmt.handlers[i]);
                }
                if(stmt.finalizer) {
                    result += ' finally' + maybeBlock(stmt.finalizer);
                }
                return result;

            case Syntax.SwitchStatement:
                // http://docstore.mik.ua/orelly/webprog/jscript/ch06_05.htm
                // swith statement compare both value and type
                var visitor = new ExprVisitor();                
                var tmpVar = visitor.generate(stmt.discriminant);                
                result = 'switch(' + tmpVar + '){';
                if(stmt.cases) {
                    for( i = 0, len = stmt.cases.length; i < len; i += 1) {
                        result += generateStatement(stmt.cases[i]);
                    }
                }
                result += '}';
                return result;

            case Syntax.SwitchCase:
                // TODO:
                if(stmt.test) {
                    var visitor = new ExprVisitor();
                    // TODO: make generate don't generate new tmp, but only annoymous function
                    var expr = visitor.generateExpr(stmt.test);                                           
                    result = 'case ' + expr + ':';
                } else {
                    result = 'default:';
                }
                i = 0;
                len = stmt.consequent.length;
                if(len && stmt.consequent[0].type === Syntax.BlockStatement) {
                    result += maybeBlock(stmt.consequent);
                    i = 1;
                }

                for(; i < len; i += 1) {
                    result += generateStatement(stmt.consequent[i]);
                }
                return result;

            case Syntax.IfStatement:            
                // NOTE: if else if => if { } else { if }
                var visitor = new ExprVisitor();
                var tmpVar = visitor.generate(stmt.test);
                result = '';
                result += Util.merge(visitor.code);
                visitor.reset(); // clear out
                // if clause
                result += 'if(' + tmpVar + ')';
                result += maybeBlock(stmt.consequent)
                // else if or else clause                 
                if(stmt.alternate) {                    
                    if(stmt.alternate.type === Syntax.IfStatement) {                         
                        result += 'else{' + generateStatement(stmt.alternate) + '}';
                    } else {
                        result += 'else' + maybeBlock(stmt.alternate);
                    }
                } 
                return result;

            case Syntax.ForStatement:
                // for (expr1;expr2;expr3) => expr1; for(;tmpVar;) { ... expr3; expr2}
                var visitor = new ExprVisitor();
                if(stmt.init) {
                    if(stmt.init.type === Syntax.VariableDeclaration) {
                        result = generateStatement(stmt.init);
                    } else {
                        visitor.generate(stmt.init, false) + ';';
                        result += Util.merge(visitor.code);
                        visitor.reset();
                    }
                }
                visitor.generate(stmt.update);
                var after = Util.merge(visitor.code);
                visitor.reset();
                var tmpVar = visitor.generate(stmt.test);
                var testCode = Util.merge(visitor.code); 
                after += testCode;
                result += testCode;
                result += 'for(;';
                if(stmt.test) {
                    result += ' ' + tmpVar + ';)';
                } else {
                    result += ';)';
                }                
                result += maybeBlock(stmt.body, {after: after});
                return result;

            case Syntax.ForInStatement:
                var visitor = new ExprVisitor();
                var tmpRight = visitor.generate(stmt.right);
                var codeRight = Util.merge(visitor.code);
                var iterator = '';
                visitor.reset();             
                if(stmt.left.type === Syntax.VariableDeclaration) {
                    var newStmt = stmt.left.declarations[0];
                    iterator = newStmt.id.name;                    
                    if(newStmt.init) {
                        var tmpVar = visitor.generate(newStmt.init, newStmt.id.name);                        
                        result = Util.merge(visitor.code) + codeRight + 'for('  + newStmt.id.name;                                                
                    } else {                        
                        result = codeRight +  'for(var ' + newStmt.id.name;
                    }                    
                } else {
                    iterator = visitor.generate(stmt.left);
                    result = codeRight + 'for(' + iterator;
                }                
                result += ' in ' + tmpRight + ')';
                var before = push(stmt.left.loc, iterator);
                result += maybeBlock(stmt.body, {before: before});                
                return result;

            case Syntax.LabeledStatement:
                return stmt.label.name + ':' + maybeBlock(stmt.body);

            case Syntax.Program:
                result = '';
                for( i = 0, len = stmt.body.length; i < len; i += 1) {
                    result += generateStatement(stmt.body[i]);
                }
                return result;

            case Syntax.FunctionDeclaration:
                result = 'function ';
                if(stmt.id) {
                    result += stmt.id.name;
                }
                result += generateFunctionBody(stmt);
                return result;

            case Syntax.ReturnStatement:
                if(stmt.argument) {
                    var visitor = new ExprVisitor();
                    var tmpVar =  visitor.generate(stmt.argument);                    
                    return Util.merge(visitor.code) + 'return ' + tmpVar + ';';
                } else {
                    return 'return;';
                }

            case Syntax.WhileStatement:                
                var visitor = new ExprVisitor();
                var tmpVar =  visitor.generate(stmt.test);               
                var testCode = Util.merge(visitor.code);               
                result = testCode + 'while(' + tmpVar + ')';                
                result += maybeBlock(stmt.body, {after: testCode});                
                return result;

            case Syntax.WithStatement:
                var visitor = new ExprVisitor();
                var tmpVar =  visitor.generate(stmt.test);               
                result = Util.merge(visitor.code);
                result += 'with(' + tmpVar + ')';
                result += maybeBlock(stmt.body);
                return result;

            default:
                break;
        }

        if(result === undefined) {
            throw new Error('Unknown statement type: ' + stmt.type);
        }
        return result;
    }
    
    
    function generate(node) {
        switch (node.type) {
            case Syntax.BlockStatement:
            case Syntax.BreakStatement:
            case Syntax.CatchClause:
            case Syntax.ContinueStatement:
            case Syntax.DoWhileStatement:
            case Syntax.DebuggerStatement:
            case Syntax.EmptyStatement:
            case Syntax.ExpressionStatement:
            case Syntax.ForStatement:
            case Syntax.ForInStatement:
            case Syntax.FunctionDeclaration:
            case Syntax.IfStatement:
            case Syntax.LabeledStatement:
            case Syntax.Program:
            case Syntax.ReturnStatement:
            case Syntax.SwitchStatement:
            case Syntax.SwitchCase:
            case Syntax.ThrowStatement:
            case Syntax.TryStatement:
            case Syntax.VariableDeclaration:
            case Syntax.VariableDeclarator:
            case Syntax.WhileStatement:
            case Syntax.WithStatement:
                return generateStatement(node);

            case Syntax.AssignmentExpression:
            case Syntax.ArrayExpression:
            case Syntax.BinaryExpression:
            case Syntax.CallExpression:
            case Syntax.ConditionalExpression:
            case Syntax.FunctionExpression:
            case Syntax.Identifier:
            case Syntax.Literal:
            case Syntax.LogicalExpression:
            case Syntax.MemberExpression:
            case Syntax.NewExpression:
            case Syntax.ObjectExpression:
            case Syntax.Property:
            case Syntax.SequenceExpression:
            case Syntax.ThisExpression:
            case Syntax.UnaryExpression:
            case Syntax.UpdateExpression:
                return generateExpression(node);

            default:
                break;
        }
        throw new Error('Unknown node type: ' + node.type);

    }

	// check if rangeA contains rangeB
	function contains(rangeA, rangeB) {
	    if (rangeA === undefined || rangeB === undefined) {
	        console.log("this function should call with defined objects");
	        return false;
	    }
	    
		// definitely contain in rangeA
		if (rangeA.from.line <= rangeB.from.line && rangeB.to.line <= rangeA.to.line) {
			if (rangeA.from.ch <= rangeB.from.ch && rangeB.to.ch <= rangeA.to.ch) {
				return true;
			}
		}
		return false;
	}

	function filter(snapshot) {
		var newSnapshot = [], i, j, badEdit = false, edit;
		for (i = snapshot.length-1; i >= 0; --i) {
			edit = snapshot[i];
			badEdit = false;
			for (j = 0; j < newSnapshot.length; ++j) {
				badEdit = contains(newSnapshot[j].range, edit.range);
				if (badEdit) break;
			}
			if (!badEdit) {
				newSnapshot.push(edit);
			} 
		}
		// rather than sort, just reverse
		newSnapshot.reverse();
		return newSnapshot;
	}
	
	function buildDAG(snapshot) {
		var dag = [], i, j, inRange = false, edge;
		for (i = snapshot.length-1; i >= 0; --i) {
			inRange = false;
			edge = i;
			for (j = snapshot.length-1; j > i; --j) {
				inRange = contains(snapshot[j].range, snapshot[i].range) || contains(snapshot[i].range, snapshot[j].range);
				if (inRange) {
					edge = j;
				}				
			}
			//console.log(i + " depends " + edge);
			//console.log(snapshot[i]);			
			//console.log(snapshot[edge]);
			dag.push(edge);
		}
		dag.reverse();
		return dag;		
	}
	
    function trace(root) {
        // reset tmp count
        tmp = 0;
        var code = generate(root);
        var snapshot = Sandbox.eval(code);     
        return snapshot;
    }
        
    exports.trace = trace;
    exports.filter = filter;
	exports.buildDAG = buildDAG;
	
}( typeof exports === 'undefined' ? ( Tracer = {}) : exports));
