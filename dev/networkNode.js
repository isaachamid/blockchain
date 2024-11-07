var express = require("express");
var app = express();
const bodyParser = require("body-parser");
const Blockchain = require("./blockchain");
const { v4: uuidv4 } = require("uuid");
const nodeAddress = uuidv4().split("-").join("");
const port = process.argv[2];

const mycoin = new Blockchain();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function (req, res) {
  res.send("Blockchain API");
});

app.get("/blockchain", function (req, res) {
  res.send(mycoin);
});

app.post("/transaction", function (req, res) {
  const blockIndex = mycoin.createNewTransaction(
    req.body.amount,
    req.body.sender,
    req.body.recipient
  );
  res.json({ note: `Transaction will be added in block ${blockIndex}.` });
});

app.get("/mine", function (req, res) {
  const lastBlock = mycoin.getLastBlock();
  const previousBlockHash = lastBlock["hash"];
  const currentBlockData = {
    transactions: mycoin.pendingTransactions,
    index: lastBlock["index"] + 1,
  };
  const nonce = mycoin.proofOfWork(previousBlockHash, currentBlockData);

  mycoin.createNewTransaction(12.5, "00", nodeAddress);

  const blockHash = mycoin.hashBlock(
    previousBlockHash,
    currentBlockData,
    nonce
  );
  const newBlock = mycoin.createNewBlock(nonce, previousBlockHash, blockHash);
  res.json({
    note: "New block mined successfully",
    block: newBlock,
  });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}...`);
});
