/*eslint-env es6*/
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.buildNGrams = buildNGrams;
exports.listNGramsByCount = listNGramsByCount;
var getSplitter = function getSplitter(options) {
    return options.includePunctuation ? new RegExp('[^\.\?!;]+[\.\?!;]', 'g') : new RegExp('[^.?!;]+', 'g');
};

var preProcessing = function preProcessing(sentenceList, options) {
    for (var i = 0, len = sentenceList.length; i < len; i++) {
        var subSentence = sentenceList[i];
        if (options.includePunctuation) {
            sentenceList[i] = subSentence.replace(/([\?\.!;])/, ' $1');
        }
        sentenceList[i] = sentenceList[i].replace(/([^\w]*-[^\w])+|[\s,:]+/g, ' ').replace(/^\s/, '').split(/\s+/g);
    }
};

var addItemToList = function addItemToList(countList, key, item) {
    if (countList.hasOwnProperty(key)) {
        countList[key].push(item);
    } else {
        countList[key] = [item];
    }
};

function buildNGrams(text, unit, options) {
    var nGrams = {};
    var sentenceList = [];

    unit = unit || 1;
    options = options || {};

    if (!text || !text.length) {
        return nGrams;
    }
    if (!options.caseSensitive) {
        text = text.toLowerCase();
    }

    sentenceList = text.match(getSplitter(options));
    preProcessing(sentenceList, options);

    for (var sentence = 0, len = sentenceList.length; sentence < len; sentence++) {
        var subSentence = sentenceList[sentence],
            subLen = subSentence.length - unit + 1;
        for (var word = 0; word < subLen; word++) {
            var start = '',
                bucket = void 0;
            for (var gramLength = 0, uLen = unit - 1; gramLength < uLen; gramLength++) {
                start += subSentence[word + gramLength] + ' ';
            }
            start = start.slice(0, start.length - 1);
            var end = subSentence[word + unit - 1];
            if (unit === 1) {
                bucket = nGrams;
            } else {
                if (!nGrams.hasOwnProperty(start)) {
                    nGrams[start] = {};
                }
                bucket = nGrams[start];
            }
            if (bucket.hasOwnProperty(end)) {
                bucket[end]++;
            } else {
                bucket[end] = 1;
            }
        }
    }
    return nGrams;
}

function listNGramsByCount(data, unit) {
    var nGrams = buildNGrams(data, unit),
        countList = {};
    Object.keys(nGrams).forEach(function (word) {
        var grams = nGrams[word];
        if (typeof grams === 'number') {
            addItemToList(countList, grams, word);
        } else {
            Object.keys(grams).forEach(function (obj) {
                addItemToList(countList, grams[obj], word + ' ' + obj);
            });
        }
    });
    return countList;
}