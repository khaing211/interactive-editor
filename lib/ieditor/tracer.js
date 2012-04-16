(function(exports) {
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
    
    // Uncollapse tree into real code mix with our API call
    function generate(tree) {
        return 'var x = 1; x;';
    }    
    
    function trace(tree) {
        var code = generate(tree);
        var snapshot = Sandbox.eval(code);
        return snapshot;
    }
            
    exports.trace = trace;

}( typeof exports === 'undefined' ? ( Tracer = {}) : exports));
