const express = require('express');
const sqlite3 = require('sqlite3');
const app = express();
const PORT = 4000;
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

//Routers
const artistsrouter = require('./api/artists');
app.use('/api/artists/', artistsrouter);


app.listen(process.env.PORT || PORT, () => {console.log(`Listening on Port: ${PORT}`)});
module.exports = app;
