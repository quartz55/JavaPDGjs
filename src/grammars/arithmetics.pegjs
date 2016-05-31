additive
    = left:multiplicative op:OPADD right:additive { return {left:left, op:op, right:right}; }
    / multiplicative

multiplicative
    = left:primary op:OPMULTI right:multiplicative { return {left:left, op:op, right:right}; }
    / primary

primary
    = integer
    / OPENPAREN additive:additive CLOSEPAREN { return additive; }

integer "integer"
    = _ digits:[0-9]+ _ { return parseInt(digits.join(''), 10); }

/**
 * Define tokens
 */

OPENPAREN = _ '(' _
CLOSEPAREN = _ ')' _

OPADD
    = _ c:"+" _ {return c;}
    / _ c:"-" _ {return c;}

OPMULTI
    = _ c:"*" _ {return c;}
    / _ c:"/" _ {return c;}

_
    = [ \r\n\t]*
 
