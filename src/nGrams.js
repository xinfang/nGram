/*eslint-env es6*/
'use strict';
const getSplitter = (options) => {
    return options.includePunctuation ? new RegExp('[^\.\?!;]+[\.\?!;]', 'g') : new RegExp('[^.?!;]+', 'g');
};

const preProcessing = (sentenceList, options) => {
    for (let i = 0, len = sentenceList.length; i < len; i++) {
        const subSentence = sentenceList[i];
        if (options.includePunctuation) {
            sentenceList[i] = subSentence.replace(/([\?\.!;])/, ' $1');
        }
        sentenceList[i] = sentenceList[i].replace(/([^\w]*-[^\w])+|[\s,:]+/g, ' ')
            .replace(/^\s/, '')
            .split(/\s+/g);
    }
};

const addItemToList = (countList, key, item) => {
    if (countList.hasOwnProperty(key)) {
        countList[key].push(item);
    } else {
        countList[key] = [item];
    }
};

export function buildNGrams(text, unit, options) {
    const nGrams = {};
    let sentenceList = [];

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

    for (let sentence = 0, len = sentenceList.length; sentence < len; sentence++) {
        const subSentence = sentenceList[sentence],
            subLen = subSentence.length - unit + 1;
        for (let word = 0; word < subLen; word++) {
            let start = '',
                bucket;
            for (let gramLength = 0, uLen = unit - 1; gramLength < uLen; gramLength++) {
                start += subSentence[word + gramLength] + ' ';
            }
            start = start.slice(0, start.length - 1);
            const end = subSentence[word + unit - 1];
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

export function listNGramsByCount(data, unit) {
    const nGrams = buildNGrams(data, unit),
        countList = {};
    Object.keys(nGrams).forEach((word) => {
        const grams = nGrams[word];
        if (typeof grams === 'number') {
            addItemToList(countList, grams, word);
        } else {
            Object.keys(grams).forEach((obj) => {
                addItemToList(countList, grams[obj], word + ' ' + obj);
            });
        }
    });
    return countList;
}
