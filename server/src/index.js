#!/usr/bin/env node

const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');

const pylonCeramics = require("./pylon-ceramics")

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const server = app.listen(36007, function () {
  console.log("port:", server.address().port);
});

pylonCeramics(app);