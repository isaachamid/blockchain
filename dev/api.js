var express = require("express");
var app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function (req, res) {
  res.send("Blockchain API");
});

app.get("/blockchain", function (req, res) {});

app.post("/transaction", function (req, res) {
  res.send(`The amount of the transaction is ${req.body.amount} coins`);
});

app.get("/mine", function (req, res) {});

app.listen(3000, function () {
  console.log("Listening on port 3000...");
});
