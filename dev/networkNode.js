var express = require("express");
var app = express();
const bodyParser = require("body-parser");
const Blockchain = require("./blockchain");
const { v4: uuidv4 } = require("uuid");
const nodeAddress = uuidv4().split("-").join("");
const port = process.argv[2];
const rp = require("request-promise");

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

app.post("/register-and-broadcast-node", function (req, res) {
  const newNodeUrl = req.body.newNodeUrl;
  if (mycoin.networkNodes.indexOf(newNodeUrl) == -1)
    mycoin.networkNodes.push(newNodeUrl);

  const regNodesPromises = [];
  mycoin.networkNodes.forEach((networkNodeUrl) => {
    const requestOptions = {
      uri: networkNodeUrl + "/register-node",
      method: "POST",
      body: {
        newNodeUrl: newNodeUrl,
      },
      json: true,
    };
    regNodesPromises.push(rp(requestOptions));
  });
  Promise.all(regNodesPromises)
    .then((data) => {
      const bulkRegisterOptions = {
        url: newNodeUrl + "/register-nodes/bulk",
        method: "POST",
        body: {
          allNetworkNodes: [...mycoin.networkNodes, mycoin.currentNodeUrl],
        },
        json: true,
      };
      return rp(bulkRegisterOptions);
    })
    .then((data) => {
      res.json({ note: "New node registered with network successfully." });
    });
});

app.post("/register-node", function (req, res) {
  const newNodeUrl = req.body.newNodeUrl;
  if (
    mycoin.networkNodes.indexOf(newNodeUrl) == -1 &&
    mycoin.currentNodeUrl !== newNodeUrl
  )
    mycoin.networkNodes.push(newNodeUrl);
  res.json({ note: "New node registered successfully." });
});

app.post("/register-nodes-bulk", function (req, res) {
  const allNetworkNodes = req.body.allNetworkNodes;
  allNetworkNodes.forEach((networkNodeUrl) => {
    if (
      mycoin.networkNodes.indexOf(networkNodeUrl) == -1 &&
      mycoin.currentNodeUrl !== networkNodeUrl
    )
      mycoin.networkNodes.push(networkNodeUrl);
  });
  res.json({ note: "Bulk registration successful." });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}...`);
});
