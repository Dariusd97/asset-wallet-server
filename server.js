const express = require("express");
const app = express();

app.use(express.static("."));
app.use(express.json());
app.use(express.json());

app.listen(8081, () => console.log('Connection open'));

module.exports = app;