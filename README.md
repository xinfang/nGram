
Refers to ngram word and n-gram

Create an application that can take as input any text file and output a histogram of the bigrams
in the text.

A bigram is any two adjacent words in the text disregarding case. A histogram is the count of
how many times that particular bigram occurred in the text.

Exmpale:

Given the text: “The quick brown fox and the quick blue hare.” The bigrams with their counts
would be.
● “the quick” 2
● “quick brown” 1
● “brown fox” 1
● “fox and” 1
● “and the” 1
● “quick blue” 1
● “blue hare” 1

Install the dependencies(node >= V6.10.2):

```
  npm install
```

ESlint check 
```
  npm run lint
```

To build
```
  npm run build
```

To run
```
  npm start
```

Read from file 
```
  npm start test.txt
```

To run the tests, try:
```
  npm test
```
