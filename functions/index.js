const functions = require('firebase-functions');
const express = require('express');
const nanoidUrl = require('nanoid/url');
const nanoidGenerate = require('nanoid/generate');
const cors = require('cors')({origin: true});

const app = express();
const generateHash = () => nanoidGenerate(nanoidUrl, 15);
const getHashFromUrl = url => url.split('/serve/')[1];

const database = {};

app.get('/serve/*', (req, res) => {
  cors(req, res, () => {
    res.setHeader('Content-type', 'application/json');
    const hash = getHashFromUrl(req.originalUrl);
    res.send(JSON.stringify(database[hash]));
  });
});

app.post('/submit', (req, res) => {
  cors(req, res, () => {
    const url = generateHash();
    database[url] = req.body;
    res.send({ url });
  });
});

exports.app = functions.https.onRequest(app);
