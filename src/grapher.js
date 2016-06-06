'use strict';

const assert = require('assert');
const graphviz = require('graphviz');

class SymbolTable {
  constructor() {
    this._globalSymbolList = [{}];
    this._currScopeID = 0;
  }

  insert(symbol, values) {
    this._globalSymbolList[this._currScopeID][symbol] = values;
  }

  lookup(symbol) {
    let tmp_scope = this._currScopeID;
    for (let i = this._currScopeID; i >= 0; --i) {
      if (this._globalSymbolList[i] &&
          this._globalSymbolList[i].hasOwnProperty(symbol)) {
        return {
          values: this._globalSymbolList[i][symbol],
          scope: i,
          currScope: this._currScopeID
        };
      }
    }
    return undefined;
  }

  enter() {
    this._globalSymbolList[++this._currScopeID] = {};
  }

  exit() {
    this._globalSymbolList.splice(this._currScopeID, 1);
    --this._currScopeID;
  }
}

class ASTClass {
  constructor(AST) {
    if (typeof AST === 'string') AST = JSON.parse(AST);
    assert(typeof AST === 'object', 'Invalid AST type provided');
    this.AST = AST;
    this.graphIDCounter = 0;
    this.functions = [];
    this.symbolTable = new SymbolTable();
  }

  createClassPDG(multiple = false) {
    const checkNode = (graph, node, g_node) => {
      if (node.node === "VariableDeclarationStatement" || node.node === 'VariableDeclarationExpression' || node.node === 'CatchClause') {
        node.defs.forEach(def => {
          let lookup = this.symbolTable.lookup(def);
          if (lookup && lookup.scope === lookup.currScope) {
            throw new Error("Variable already declared: " + def);
          }
          else{
            this.symbolTable.insert(def, g_node);
          }
        });
        node.uses.forEach(use => {
          let lookup = this.symbolTable.lookup(use);
          if (lookup) {
            graph.addEdge(lookup.values, g_node, {color: "red"});
          }
          else throw new Error("Variable not declared: " + use);
        });
      }
      else {
        node.defs.forEach(def => {
          let lookup = this.symbolTable.lookup(def);
          if (lookup) {
            this.symbolTable.insert(def, g_node);
            graph.addEdge(lookup.values, g_node, {color: "red"});
          }
          else throw new Error("Variable not declared: " + def + JSON.stringify(node));
        });
        node.uses.forEach(use => {
          let lookup = this.symbolTable.lookup(use);
          if (lookup) {
            graph.addEdge(lookup.values, g_node, {color: "red"});
          }
          else throw new Error("Variable not declared: " + use);
        });
      }
    };

    const graphNode = (graph, root, node) => {
      let g_node = graph.addNode(this.graphIDCounter++, {label: node.name || node.statement});
      graph.addEdge(root, g_node);
      if (node.loop) graph.addEdge(g_node, g_node);

      if (node.node === 'ForStatement') {
        this.symbolTable.enter();
        node.stmt.forEach(st => checkNode(graph, st, g_node));
      }
      else if (node.node === 'CatchClause') {
        this.symbolTable.enter();
        checkNode(graph, node, g_node);
      }
      else {
        checkNode(graph, node, g_node);
      }
      if (node.node === "ReturnStatement")
        setNodeAttrs(g_node, {fontcolor: "black", fillcolor: "grey", style: "filled", shape: "hexagon"});

      try {
        if (node.children.length) {
          setNodeAttrs(g_node, {ordering: "out"});
          if (node.node === "ElseStatement") {
            this.symbolTable.exit();
            this.symbolTable.enter();
          }
          if (node.node !== 'ForStatement' && node.node !== 'CatchClause') this.symbolTable.enter();
          node.children.forEach(child => {
            graphNode(graph, g_node, child);
          });
          this.symbolTable.exit();
        }
        else if (node.node === 'ForStatement' || node.node === 'CatchClause') {
          this.symbolTable.exit();
        }
      } catch (err) {
        console.dir(err, {depth: null, colors: true});
        console.dir(node, {depth: null, colors: true});
        process.exit(-1);
      }

    };

    const createFunctionGraph = (fn, g) => {
      let mainGraph = !!g;
      g = g || graphviz.digraph(fn.name || "FuncName");

      let rootNode = g.addNode(this.graphIDCounter++, {label: fn.name || "FuncName", fontcolor: "white", color: "black", style: "filled", shape: "hexagon", ordering: "out"});
      rootNode.set("style", "filled");
      this.symbolTable.enter();
      fn.children.forEach(child => {
        graphNode(g, rootNode, child);
      });
      this.symbolTable.exit();
      if (!mainGraph) return g;
      return undefined;
    };

    if (this.AST.functions) {
      if (multiple)
        return this.AST.functions.map(fn => createFunctionGraph(fn));

      let graph = graphviz.digraph(this.AST.className || "ClassName");
      this.AST.functions.forEach(fn => createFunctionGraph(fn, graph));
      return [ graph ];
    }
    return [];
  }

  export(type, multiple = false) {
    this.createClassPDG(multiple).forEach(g => {
      try {
        g.output(type, g.id+'.'+type);
      } catch (err) {
        console.error("Couldn't export graph "+g.id+" to image. Reason: ", err);
      }
    });
  }
}

// NOTE: Por alguma razão a biblioteca deixa enviar um objeto com os atributos de um node
// na criaçao deste, mas só deixa modificar atributos um a um depois... :v
function setNodeAttrs(node, attrs) {
  for (let k in attrs)
    node.set(k, attrs[k]);
}

module.exports = {
  grapher: function(AST, type = 'png', multiple = false) {
    new ASTClass(AST).export(type, multiple);
  },
  dot: function(AST, multiple = false) {
    return new ASTClass(AST).createClassPDG(multiple).map(g => g.to_dot());
  }
};
