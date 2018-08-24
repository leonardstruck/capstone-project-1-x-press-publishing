const express = require('express');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

var seriesrouter = express.Router();
//GET REQUESTS
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
});

seriesrouter.get('/:id/issues', (req, res) => {
  db.all("SELECT * FROM Issue WHERE series_id = $id", {$id: req.params.id}, (err, rows) => {
    if(err || rows.length == 0) {
      res.status(404).send({issues: []});
    } else {
      res.status(200).send({issues: rows});
    }
  })
});

//POST REQUESTS
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

seriesrouter.post('/:id/issues', (req, res) => {
  if(req.body.issue.name || req.body.issue.issueNumber || req.body.issue.publicationDate || req.body.issue.artistId) {
    db.run("INSERT INTO Issue (name, issue_number, publication_date, artist_id, series_id) VALUES ($name, $issuenumber, $publicationdate, $artistid, $seriesid)", {$name: req.body.issue.name, $issuenumber: req.body.issue.issueNumber, $publicationdate: req.body.issue.publicationDate, $artistid: req.body.issue.artistId, $seriesid: req.params.id}, function(err) {
      if(!err) {
        db.get("SELECT * FROM Issue WHERE id = $id", {$id: this.lastID}, (err, row) => {
          if(!err) {
            res.status(201).send({issue: row});
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

//PUT REQUESTS
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

seriesrouter.put('/:id/issues/:issueId', (req, res, next) => {
  db.all("SELECT * FROM Issue WHERE id = $id", {$id: req.params.issueId}, (err, row) => {
    if(row.length == 0) {
      res.status(404).send();
    } else {
      if(req.body.issue.name || req.body.issue.issueNumber || req.body.issue.publicationDate || req.body.issue.artistId) {
        db.run("UPDATE Issue SET name = $name, issue_number = $issuenumber, publication_date = $publicationdate, artist_id = $artistid, series_id = $seriesid WHERE id = $id", {$name: req.body.issue.name, $issuenumber: req.body.issue.issueNumber, $publicationdate: req.body.issue.publicationDate, $artistid: req.body.issue.artistId, $seriesid: req.params.id, $id: req.params.issueId}, function(err) {
          if(!err) {
            db.get("SELECT * FROM Issue WHERE id = $id", {$id: req.params.issueId}, (err, row) => {
              if (!err) {
                res.status(200).send({issue: row});
              }
            });
          } else {
           res.status(400).send();
          }
        });
      } else {
        res.status(400).send();
      }
    }
  })

});

//DELETE REQUESTS
seriesrouter.delete('/:id', (req, res) => {
  if(req.params.id) {
    db.all("SELECT * FROM Issue WHERE series_id = $id", {$id: req.params.id}, (err, rows) => {
      if(rows.length == 0) {
        db.run("DELETE FROM Series WHERE id = $id", {$id: req.params.id}, (err) => {
          if(!err) {
            res.status(204).send();
          }
        });
      } else {
        res.status(400).send();
      }
    })
  } else {
    res.status(400).send();
  }
});

module.exports = seriesrouter;
