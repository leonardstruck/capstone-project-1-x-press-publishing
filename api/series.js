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

seriesrouter.post('/', (req, res) => {
  if(req.body.series.name || req.body.series.description) {
    db.run("INSERT INTO Series (name, description) VALUES ($name, $description)", {$name: req.body.series.name, $description: req.body.series.description}, function (err) {
        if(!err) {
          db.get("SELECT * FROM Series WHERE id = $id", {$id: this.lastID}, (err, row) => {
            if(!err) {
              res.status(201).send({series: row})
            }
          });
        } else {
            res.status(400).send();
        }
    });
}});

seriesrouter.put('/:id', (req, res) => {
  if(req.body.series.name || req.body.series.description) {
    db.run("UPDATE Series SET name = $name, description = $description WHERE id = $id", {$name: req.body.series.name, $description: req.body.series.description, $id: req.params.id}, function (err) {
      if(!err) {
        db.get("SELECT * FROM Series WHERE id = $id", {$id: req.params.id}, (err, row) => {
          if(!err) {
            res.status(200).send({series: row});
          }
        });
      } else {
        res.status(400).send();
      }
    });
  } else {
    res.status(400).send();
  }
});

module.exports = seriesrouter;
