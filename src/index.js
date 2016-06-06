'use strict';

const parser = require('./parser.js');
const grapher = require('./grapher.js');

function buildAST (javaFile, debug = false) {
  return parser.parseFile(javaFile, debug);
}

function getDOT (javaFile) {
  return grapher.dot(parser.parseFile(javaFile));
}

function exportDOTfile (javaFile) {
  grapher.grapher(buildAST(javaFile), 'dot');
}

function exportImagefile (javaFile) {
  grapher.grapher(buildAST(javaFile), 'png');
}

module.exports = {
  buildAST:        buildAST,
  getDOT:          getDOT,
  exportDOTfile:   exportDOTfile,
  exportImagefile: exportImagefile,
  grapher:         grapher
};
