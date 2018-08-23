const express = require('express');
var app = express();
const PORT = 4000;

app.listen(process.env.PORT || PORT, () => {console.log(`Listening on Port: ${PORT}`)});
module.exports = app;
