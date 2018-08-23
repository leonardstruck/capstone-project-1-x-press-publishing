const express = require('express');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

var artistsrouter = express.Router();

artistsrouter.get('/', (req, res) => {
  db.all("SELECT * FROM Artist WHERE is_currently_employed = 1", (err, rows) => {
    if(err) {
      console.log(err);
    } else {
      res.status(200).send({artists: rows});
    }
  })
});

artistsrouter.get('/:id', (req, res) => {
  db.get("SELECT * FROM Artist WHERE id = " + req.params.id, (err, row) => {
    if(err || !row) {
      res.status(404).send();
    } else {
      res.status(200).send({artist: row});
    }
  })
});

module.exports = artistsrouter;
