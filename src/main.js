/*eslint-env es6*/
'use strict';
import { listNGramsByCount } from './nGrams.js';
import fs from 'fs';
import byline from 'byline';

const displaynGrams = (list) => {
    Object.keys(list)
        .sort((k1, k2) => {
           return k2 - k1;
        })
        .forEach((count) => {
            list[count].forEach((item) => {
                 process.stdout.write(item + ' ' + count + '\n');
            });
       });
};

const readFromFile = (fileName) => {
    byline(fs.createReadStream(fileName, { encoding: 'utf8' }))
    .on('data', (line) => { //depend parser each line or whole files
        displaynGrams(listNGramsByCount(line, 2));
    })
    .on('end', () => {});
};

const main = (content) => {
    process.stdout.write('=============Bigrams===============\n');
    displaynGrams(listNGramsByCount(content, 2));
    process.stdout.write('=============Done==================\n');
    process.stdout.write('> ');
};

const name = process.argv[2];
if (name && ~name.length) {
    fs.exists(name, (exists) => {
        if (!exists) {
            console.log('Can not found file! please try again.');
            return;
        }
        readFromFile(name);
    });
} else {
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdout.write('> ');
    process.stdin.on('data', (data) => {
        main(data);
    });
    process.stdin.on('end', () => {});
}
