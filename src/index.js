'use strict';

// ------------ REQUIRES
const fs = require('fs');
const path = require('path');
const pegjs = require('pegjs');

// ------------ CONSTANTS

const parser_filename = "./arithmetics.js";
const parser = require(parser_filename);

// ------------ PROGRAM

const args = process.argv.slice(2);

if (args.length === 0) {
    const stdin = process.stdin;
    stdin.resume();
    stdin.setEncoding("utf8");

    let data = "";
    stdin.on('data', d => data += d);
    stdin.on('end', () => showParsed(parser.parse(data)));
}
else {
    args.forEach(parseFile);
}

function parseFile (filename) {
    console.log("Parsing file: "+filename);
    const file = fs.readFileSync(filename, "utf8");
    showParsed(parser.parse(file));
}

function showParsed (obj) {
    console.log(JSON.stringify(obj, null, 2));
}
