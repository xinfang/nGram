import { expect } from 'chai';
import { buildNGrams, listNGramsByCount } from '../src/nGrams.js';

describe('The buildNGrams method', function() {
    it('should work on an empty string', function() {
        var emptyGrams = buildNGrams('', 1);
        expect(emptyGrams).to.deep.equal({});
    });

    it('should be able to build unigrams', function() {
        var unigrams = buildNGrams('Hello world!', 1);
        expect(unigrams).to.deep.equal({
            hello: 1,
            world: 1
        });
    });

    it('should track a compound word as a single word', function() {
        var unigrams = buildNGrams('This is a top-notch test.', 1);
        expect(unigrams).to.deep.equal({
            "this": 1,
            is: 1,
            a: 1,
            "top-notch": 1,
            test: 1
        });
    });

    it('should allow for apostrophes in words', function() {
        var unigrams = buildNGrams("I'm hyphenated!", 1);
        expect(unigrams).to.deep.equal({
            "i'm": 1,
            hyphenated: 1
        });
    });

    it('should track numbers as words', function() {
        var unigrams = buildNGrams("Here's 1 more test", 1);
        expect(unigrams).to.deep.equal({
            "here's": 1,
            "1": 1,
            more: 1,
            test: 1
        });
    });

    it('should be able to build nGrams with punctuation', function() {
        var unigrams = buildNGrams('Hello, world.  How are you?', 1, {
            includePunctuation: true
        });
        expect(unigrams).to.deep.equal({
            hello: 1,
            world: 1,
            '.': 1,
            how: 1,
            are: 1,
            you: 1,
            '?': 1
        });
    });

    it('should be able to build case sensitive nGrams', function() {
        var unigrams = buildNGrams('Hello World! Hello world!', 1, {
            caseSensitive: true
        });
        expect(unigrams).to.deep.equal({
            Hello: 2,
            World: 1,
            world: 1
        });
    });

    it('should be able to build nGrams of arbitrary length', function() {
        var bigrams = buildNGrams("How are you doing today?", 2);
        expect(bigrams).to.deep.equal({
            how: {
                are: 1
            },
            are: {
                you: 1
            },
            you: {
                doing: 1
            },
            doing: {
                today: 1
            }
        });
        var trigrams = buildNGrams("How are you doing today?", 3);
        expect(trigrams).to.deep.equal({
            "how are": {
                you: 1
            },
            "are you": {
                doing: 1
            },
            "you doing": {
                today: 1
            }
        });
        var quadrigrams = buildNGrams("How are you doing today?", 4);
        expect(quadrigrams).to.deep.equal({
            "how are you": {
                doing: 1
            },
            "are you doing": {
                today: 1
            }
        });
        var quintigrams = buildNGrams("How are you doing today", 5)
        expect(quintigrams).to.deep.equal({
            "how are you doing": {
                today: 1
            }
        });
    });

    it('should not build nGrams greater than the length of the input text', function() {
        var trigrams = buildNGrams("Hello, world", 3);
        expect(trigrams).to.deep.equal({});
    });
});


describe('The listNGramsByCount method', function() {
    it('should sort a set of unigrams by count', function() {
        let listOfGrams = listNGramsByCount("Hello, world!  How's the weather?  Goodbye, world!", 1);
        expect(listOfGrams).to.deep.equal({ 1: ['hello', "how's", 'the', 'weather', 'goodbye'], 2: ['world']});
    });

    it('should sort a set of bigrams by count', function() {
        let listOfGrams = listNGramsByCount("Hello, world! Hello, world!", 2);
        expect(listOfGrams).to.deep.equal({ 2: ["hello world"]});
    })
});