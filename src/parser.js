'use strict';

// ------------ REQUIRES
const fs = require('fs');
const path = require('path');
const pegjs = require('pegjs');



// ------------ CONSTANTS

const parser_filename = "./myjava.js";
const parser = require(parser_filename);


// ------------ PROGRAM

function parseFile (filename, debug = false) {
  console.log("Parsing file: "+filename);
  const file = fs.readFileSync(filename, "utf8");
  return parseData (file, debug);
}

function parseData (data, debug = false) {
  const parsed_tree = parser.parse(data);
  showParsed(parsed_tree);
  const trimmed_tree = trimParsed(parsed_tree);
  showParsed(trimmed_tree);
  return trimmed_tree;
}

function trimObject (obj) {
  var trimmed = {};
  if (obj.node) trimmed.node = obj.node;
  if (obj.name) trimmed.name = obj.name;
  if (obj.text) trimmed.text = obj.text;
  if (obj.defs) trimmed.defs = obj.defs;
  if (obj.uses) trimmed.uses = obj.uses;

  var children = [];
  if (obj.body) {
    if (obj.body.node === 'Block') {
      children = obj.body.statements.map(function (stmt) {
        return trimObject(stmt);
      });
    } else children = [trimObject(obj.body)];
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


// ------------ CLI

const args = process.argv.slice(2);

if (args.length === 0) {
  const stdin = process.stdin;
  stdin.resume();
  stdin.setEncoding("utf8");

  let data = "";
  stdin.on('data', d => data += d);
  stdin.on('end', () => parseData(data, true));
}
else {
  args.forEach(file => parseFile(file, true));
}

// ------------ MODULE

module.exports = {
  parseFile: parseFile,
  parseData: parseData
};
