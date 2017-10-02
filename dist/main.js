/*eslint-env es6*/
'use strict';

var _nGrams = require('./nGrams.js');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _byline = require('byline');

var _byline2 = _interopRequireDefault(_byline);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var displaynGrams = function displaynGrams(list) {
    Object.keys(list).sort(function (k1, k2) {
        return k2 - k1;
    }).forEach(function (count) {
        list[count].forEach(function (item) {
            process.stdout.write(item + ' ' + count + '\n');
        });
    });
};

var readFromFile = function readFromFile(fileName) {
    (0, _byline2.default)(_fs2.default.createReadStream(fileName, { encoding: 'utf8' })).on('data', function (line) {
        //depend parser each line or whole files
        displaynGrams((0, _nGrams.listNGramsByCount)(line, 2));
    }).on('end', function () {});
};

var main = function main(content) {
    process.stdout.write('=============Bigrams===============\n');
    displaynGrams((0, _nGrams.listNGramsByCount)(content, 2));
    process.stdout.write('=============Done==================\n');
    process.stdout.write('> ');
};

var name = process.argv[2];
if (name && ~name.length) {
    _fs2.default.exists(name, function (exists) {
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

    process.stdin.on('data', function (data) {
        main(data);
    });
    process.stdin.on('end', function () {});
}