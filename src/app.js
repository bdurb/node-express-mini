const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());

/* Returns a list of dictionary words from the words.txt file. */
const readWords = () => {
  const contents = fs.readFileSync('words.txt', 'utf8');
  return contents.split('\n');
};

// TODO: your code to handle requests

const words = readWords();
const index = Math.floor(Math.random() * words.length);
const word = words[index].toLowerCase();
const guesses = {};

server.get('/', (req, res) => {
  const wordsSoFarArray = Array.from(word).map((letter) => {
    if (guesses[letter]) {
      return letter;
    }
    return '-';
  });
  const wordsSoFar = wordsSoFarArray.join('');
  res.send({ wordsSoFar, guesses });
});

server.post('/guess', (req, res) => {
  const letter = req.body.letter.toLowerCase();
  if (!letter) {
    res.status(STATUS_USER_ERROR);
    res.json({ error: 'Must Provide a Letter' });
    return;
  }
  if (letter.length !== 1) {
    res.status(STATUS_USER_ERROR);
    res.json({ error: 'Must Provide a single Letter' });
    return;
  }
  if (guesses[letter]) {
    res.status(STATUS_USER_ERROR);
    res.json({ error: 'Cannot guess that letter again.' });
    return;
  }
  guesses[letter] = true;
  res.send({ guesses });
});

server.listen(3000);
