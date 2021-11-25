const express = require("express");
const app = express();
const authContoller = require("../controllers/auth");

//
app.post("/register", authContoller.register);
module.exports = app;
