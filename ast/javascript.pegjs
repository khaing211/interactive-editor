js_func = "function" whitespace  func:funct_name whitespace "(" whitespace ")" whitespace  "{" whitespace  stmts:js_stmt_list* whitespace "}" { return ["function", "(", ")", func, "{", stmts, "}"]; } 

funct_name = name:[a-z]+ { return name.join(""); }

js_stmt_list = js_empty_stmt / js_decl_stmt / js_def_stmt

js_empty_stmt = whitespace ";" whitespace { return ";" }

js_decl_stmt = whitespace "var" whitespace varname:var_name whitespace ";" whitespace { return ["var " + varname, "save(" + varname +")"]; }

js_def_stmt = whitespace "var" whitespace varname:var_name whitespace "=" whitespace i:integer whitespace ";" whitespace { return ["var", varname, "=", i]; }

var_name = name:[a-z]+ { return name.join(""); }

integer = digits:[0-9]+ { return digits.join(""); }

whitespace = [ \n\t]* { return ''; }