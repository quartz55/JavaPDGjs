'use strict';

const fs = require('fs');
const chokidar = require('chokidar');
const path = require('path');
const pegjs = require('pegjs');
const chalk = require('chalk');

const filename = process.argv.slice(2)[0];

if (!filename) throw new Error("Need to provide 1 file (only!) to watch");

console.log("Watching "+filename);
let watcher = chokidar.watch(filename);

watcher.on('change', filename => {
    console.log(filename + ", changed. Recompiling...");
    fs.readFile(filename, "utf8", (err, grammar_source) => {
        try {
            const parser_source = "module.exports = " + pegjs.buildParser(grammar_source, {output: "source"});

            console.log("  |- Recompiled. Writing source...");
            const tmp = path.parse(filename);
            const output_filename = path.join(__dirname, tmp.name + ".js");
            fs.writeFile(output_filename, parser_source, err => {
                if (err) throw err;
                console.log("  |- "+chalk.bgGreen.black("Done!"));
            });
        } catch (err) {
            console.error(chalk.styles.yellow.open, err, chalk.styles.yellow.close);
        }
    });
});
