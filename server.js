const express = require("express");
const app = express();
const userRoutes = require('./routes/userRoutes.js')

app.use(express.static("."));
app.use(express.json());

app.use("/user", userRoutes)


app.listen(8081, () => console.log('Connection open'));

module.exports = app;