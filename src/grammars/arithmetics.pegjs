Expression
    = head:Term tail:(_ ("+" / "-") _ Term)* {
        var result = head.result, i;

        for (i = 0; i < tail.length; i++) {
            if (tail[i][1] === "+") { result += tail[i][3].result; }
            if (tail[i][2] === "-") { result -= tail[i][3].result; }
        }

        return {
            node: "Expression",
            left: head,
            right: tail,
            text: text(),
            result: result
        };
    }

Term
    = head:Factor tail:(_ ("*" / "/") _ Factor)* {
        var result = head.result, i;

        for (i = 0; i < tail.length; i++) {
            if (tail[i][1] === "*") { result *= tail[i][3].result; }
            if (tail[i][1] === "/") { result /= tail[i][3].result; }
        }

        return {
            node: "Term",
            left: head,
            right: tail,
            text: text(),
            result: result
        };
    }

Factor
    = "(" _ expr:Expression _ ")" { return expr; }
    / Integer

Integer "integer"
    = [0-9]+ { return {node: "Integer", text: text(), result: parseInt(text(), 10) }}

_ "whitespace"
    = [ \t\n\r]*
