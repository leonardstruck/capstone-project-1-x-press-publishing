const express = require('express');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

var seriesrouter = express.Router();

seriesrouter.get('/', (req, res, next) => {
  db.all("SELECT * FROM Series", (err, rows) => {
    if(err) {
      console.log(err);
    } else {
      res.status(200).send({series: rows});
    }
  });
});

seriesrouter.get('/:id', (req, res, next) => {
  db.get("SELECT * FROM Series WHERE id = $id", {$id: req.params.id}, (err, row) => {
    if(err || !row) {
      res.status(404).send();
    } else {
      res.status(200).send({series: row});
    }
  });
})

module.exports = seriesrouter;
