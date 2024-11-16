var express = require("express");
var app = express();
const bodyParser = require("body-parser");
const Blockchain = require("./blockchain");
const { v4: uuidv4 } = require("uuid");
const nodeAddress = uuidv4().split("-").join("");
const port = process.argv[2];
const rp = require("request-promise");
const { tr } = require("date-fns/locale");

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
  const newTransaction = req.body;
  const blockIndex = mycoin.addTransactionToPendingTransactions(newTransaction);
  res.json({ note: `Transaction will be added in block ${blockIndex}.` });
});

app.post("/transaction/broadcast", function (req, res) {
  const newTransaction = mycoin.createNewTransaction(
    req.body.amount,
    req.body.sender,
    req.body.recipient
  );
  mycoin.addTransactionToPendingTransactions(newTransaction);
  const requestPromises = [];
  mycoin.networkNodes.forEach((networkNodeUrl) => {
    const requestOptions = {
      uri: networkNodeUrl + "/transaction",
      method: "POST",
      body: newTransaction,
      json: true,
    };
    requestPromises.push(rp(requestOptions));
  });
  Promise.all(requestPromises).then((data) => {
    res.json({ note: "Transaction created and broadcast successfully." });
  });
});

app.get("/mine", function (req, res) {
  const lastBlock = mycoin.getLastBlock();
  const previousBlockHash = lastBlock["hash"];
  const currentBlockData = {
    transactions: mycoin.pendingTransactions,
    index: lastBlock["index"] + 1,
  };
  const nonce = mycoin.proofOfWork(previousBlockHash, currentBlockData);

  const blockHash = mycoin.hashBlock(
    previousBlockHash,
    currentBlockData,
    nonce
  );
  const newBlock = mycoin.createNewBlock(nonce, previousBlockHash, blockHash);

  const requestPromises = [];
  mycoin.networkNodes.forEach((networkNodeUrl) => {
    const requestOptions = {
      uri: networkNodeUrl + "/recieve-new-block",
      method: "POST",
      body: { newBlock: newBlock },
      json: true,
    };

    requestPromises.push(rp(requestOptions));
  });

  Promise.all(requestPromises)
    .then((data) => {
      // reward transaction
      const requestOptions = {
        uri: mycoin.currentNodeUrl + "/transaction/broadcast",
        method: "POST",
        body: {
          amount: 12.5,
          sender: "00",
          recipient: nodeAddress,
        },
        json: true,
      };
      return rp(requestOptions);
    })
    .then((data) => {
      res.json({
        note: "New block mined and broadcasted successfully",
        block: newBlock,
      });
    });
});

app.post("/receive-new-block", function (req, res) {
  const newBlock = req.body.newBlock;
  const lastBlock = mycoin.getLastBlock();
  const correctHash = lastBlock.hash === newBlock.previousBlockHash;
  const correctIndex = lastBlock["index"] + 1 === newBlock["index"];
  if (correctHash && correctIndex) {
    mycoin.chain.push(newBlock);
    mycoin.pendingTransactions = [];
    res.json({ note: "New block received and accepted.", newBlock: newBlock });
  } else {
    res.json({ note: "New block rejected.", newBlock: newBlock });
  }
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

app.get("/consensus", function (req, res) {
  const requestPromises = [];
  mycoin.networkNodes.forEach((networkNodeurl) => {
    const requestOptions = {
      uri: networkNodeurl + "/blockchain",
      method: "GET",
      json: true,
    };
    requestPromises.push(rp(requestOptions));
  });
  Promise.all(requestPromises).then((blockchains) => {
    const currentChainLength = mycoin.chain.length;
    let maxChainLength = currentChainLength;
    let newLongestChain = null;
    let newPendingTransactions = null;

    blockchains.forEach((blockchain) => {
      if (blockchain.chain.length > maxChainLength) {
        maxChainLength = blockchain.chain.length;
        newLongestChain = blockchain.chain;
        newPendingTransactions = blockchain.pendingTransactions;
      }
    });

    if (
      !newLongestChain ||
      (newLongestChain && !mycoin.chainIsValid(newLongestChain))
    ) {
      res.json({
        note: "Current chain has not been replaced.",
        chain: mycoin.chain,
      });
    } else if (newLongestChain && mycoin.chainIsValid(newLongestChain)) {
      mycoin.chain.newLongestChain;
      mycoin.pendingTransactions = newPendingTransactions;
      res.json({
        note: "This chain has been replaced.",
        chain: mycoin.chain,
      });
    }
  });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}...`);
});
