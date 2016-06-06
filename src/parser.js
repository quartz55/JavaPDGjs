'use strict';

// ------------ REQUIRES
const fs = require('fs');
const path = require('path');
const pegjs = require('pegjs');



// ------------ CONSTANTS

const grammar_filename = path.join(__dirname, "./grammars/myjava.pegjs");

// ------------ PROGRAM

function sanitizeText(text) {
  return text.match(/.+?(?=$|\{|\n|\r)/)[0].replace(/"/g, '\\"');
}

function parseFile (filename, debug = false) {
  console.log("Parsing file: "+filename);
  const file = fs.readFileSync(filename, "utf8");
  return parseData (file, debug);
}

function parseData (data, debug = false) {
  try {
    const grammar_source = fs.readFileSync(grammar_filename, 'utf8');
    const parser = pegjs.buildParser(grammar_source);
    const parsed_tree = parser.parse(data);
    const trimmed_tree = trimParsed(parsed_tree);

    if (debug) {
      showParsed(parsed_tree);
      showParsed(trimmed_tree);
    }

    return trimmed_tree;
  } catch (err) {
    console.error(err);
    process.exit(-1);
  }
}

function trimObject (obj) {
  var trimmed = {};
  if (obj.node) trimmed.node = obj.node;
  if (obj.name) trimmed.name = obj.name;
  if (obj.text) trimmed.statement = sanitizeText(obj.text);
  if (obj.loop) trimmed.loop = obj.loop;
  if (obj.defs) trimmed.defs = obj.defs;
  if (obj.uses) trimmed.uses = obj.uses;
  if (obj.stmt) trimmed.stmt = obj.stmt;

  var children = [];
  if (obj.body) {
    if (obj.body.node === 'Block') {
      children = obj.body.statements.map(function (stmt) {
        return trimObject(stmt);
      });
    } else children = [trimObject(obj.body)];
  }
  else if (obj.thenStatement) {
    if (obj.thenStatement.node === 'Block') {
      children = obj.thenStatement.statements.map(function (stmt) {
        return trimObject(stmt);
      });
    } else children = [trimObject(obj.thenStatement)];
    if (obj.elseStatement !== null) {
      var elseObj = {
        node: "ElseStatement",
        defs: [],
        uses: [],
        statement: "else",
        children: []
      };
      if (obj.elseStatement.node === 'Block') {
        elseObj.children = obj.elseStatement.statements.map(function (stmt) {
          return trimObject(stmt);
        });
      } else elseObj.children = [trimObject(obj.elseStatement)];
      children.push(elseObj);
    }
  }

  if (obj.catchClauses) {
    children = children.concat(obj.catchClauses.map(function (clause) { return trimObject(clause); }));
  }

  trimmed.children = children;

  return trimmed;
}
function trimParsed (tree) {
  var final = {
    className: '',
    functions: []
  };
  tree.forEach(function (obj) {
    if (obj.node && obj.node === 'ClassDeclaration') {
      final.className = obj.name.identifier;
      obj.bodyDeclarations.forEach(function (decl) {
        if (decl.node && decl.node === 'MethodDeclaration')
          final.functions.push(trimObject(decl));
      });
      return;
    }
  });
  return final;
}

function showParsed (obj) {
  console.dir(obj, {depth: null, colors: true});
}


// ------------ MODULE

module.exports = {
  parseFile: parseFile,
  parseData: parseData
};
