var express = require("express");
var app = express();

app.get("/", function (req, res) {
  res.send("Blockchain API");
});

app.get("/blockchain", function (req, res) {});

app.post("/transaction", function (req, res) {});

app.get("/mine", function (req, res) {});

app.listen(3000, function () {
  console.log("Listening on port 3000...");
});
