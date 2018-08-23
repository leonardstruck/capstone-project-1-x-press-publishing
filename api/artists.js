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

artistsrouter.post('/', (req, res) => {
  if(req.body.artist.name || req.body.artist.dateOfBirth || req.body.artist.biography) {
    db.run("INSERT INTO Artist (name, date_of_birth, biography, is_currently_employed) VALUES ($name, $dob, $biography, 1)", {$name: req.body.artist.name, $dob: req.body.artist.dateOfBirth, $biography: req.body.artist.biography}, function (err) {
        if(!err) {
          db.get("SELECT * FROM Artist WHERE id = $id", {$id: this.lastID}, (err, row) => {
            if(!err) {
              res.status(201).send({artist: row})
            }
          });
        } else {
            res.status(400).send();
        }
    });
}});

artistsrouter.put('/:id', (req, res) => {
  if(req.body.artist.name || req.body.artist.dateOfBirth || req.body.artist.biography) {
    db.run("UPDATE Artist SET name = $name, date_of_birth = $dob, biography = $biography WHERE id = $id", {$name: req.body.artist.name, $dob: req.body.artist.dateOfBirth, $biography: req.body.artist.biography, $id: req.params.id}, function (err) {
      if(!err) {
        db.get("SELECT * FROM Artist WHERE id = $id", {$id: req.params.id}, (err, row) => {
          if(!err) {
            res.status(200).send({artist: row});
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

artistsrouter.delete('/:id', (req, res) => {
  if(req.params.id) {
    db.run("UPDATE ARTIST SET is_currently_employed = 0 WHERE id = $id", {$id: req.params.id}, function(err) {
      if(!err) {
        db.get("SELECT * FROM Artist WHERE id = $id", {$id: req.params.id}, (err, row) => {
          if(!err) {
            res.status(200).send({artist: row});
          }
        });
      } else {
        res.status(400).send();
      }
    });
  } else {
    res.status(400).send();
  }
})
module.exports = artistsrouter;
