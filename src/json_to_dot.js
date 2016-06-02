var assert = require('assert');
var util = require('util');
var graphviz = require('graphviz');

class Node {
    constructor(id, statement, defs, uses, scope, graphed) {
        this.id = id;
        this.statement = statement;
        this.defs = defs;
        this.uses = uses;
        this.scope = scope;
        this.graphed = graphed;
    }
}

function generateDotFile(json_g) {
    if(typeof json_g === "string")
        var gclass = JSON.parse(json_g);
    
    gclass.forEach(function(gfunction) {
        var gdot = graphviz.digraph("".concat(gfunction.name));
        createNodes(gfunction, gdot);
    }, this);
}

function createNodes(gfunction, gdot) {
    var nodes = new Array();
    var id = -1;
    var scope = 1;
    
    gfunction.body.forEach(function(node) {
        if(node.children === undefined)
        {
            const n = new Node(id++, node.statement, node.defs, node.uses, 1, false);
            nodes.push(n);
        }
        else
        {
            const n = new Node(id++, node.statement, node.defs, node.uses, scope++, false);
            nodes.push(n);            
            node.children.forEach(function(node) {
                const n = new Node(id++, node.statement, node.defs, node.uses, scope++, false);
                nodes.push(n);
            }, this);   
        }
    }, this);
    
    getControlGraph(gdot, nodes);
    // getDataGraph(gdot);
}

function getControlGraph(gdot, nodes) {
    var node_statement = null;
    
    nodes.forEach(function(node) {
        if(!node.graphed) {
            var n = gdot.addNode(node.statement, {"color": "black"});
            n.set("style", "filled");
            node.graphed = true;
            
            if(node.scope > 1)
            {
                nodes.forEach(function(child) {
                    if((node.scope == child.scope) && (node.id < child.id)) {
                        if(child.graphed == false) {
                            var n = gdot.addNode(child.statement, {"color": "black"});
                            n.set("style", "filled");
                            child.graphed = true;
                            var e = gdot.addEdge(node, child);
                            e.set("color", "blue");
                        }
                    }                        
                }, this);
            }
            
            if(node_statement != null) {
                gdot.addEdge(node.statement, node_statement);
                node_statement = node.statement;
            }
            else
                node_statement = node.statement;
        }
    }, this);
    
    console.log(gdot.to_dot());
}

var obj = {
    "f1": {
        "name": "Ola",
        "body": {
            "n1": {
                "statement": "int a = 0",
                "defs": "a",
                "uses": ""
            },
            "n2": {
                "statement": "int b = 1",
                "defs": "b",
                "uses": ""
            },
            "n3": {
                "statement": "while(a > b)",
                "defs": "",
                "uses": "[a, b]",
                "children": {
                    "n4": {
                        "statement": "a++",
                        "defs": "a",
                        "uses": "a"
                    }
                }
            }
        }
    }
}