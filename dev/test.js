const Blockchain = require("./blockchain");

const mycoin = new Blockchain();
mycoin.createNewBlock(111, "AAA", "BBB");

mycoin.createNewTransaction(100, "SENDER_ADDRESS", "RECIPIENT_ADDRESS");

mycoin.createNewBlock(112, "CCC", "DDD");

mycoin.createNewTransaction(30, "SENDER_ADDRESS", "RECIPIENT_ADDRESS");
mycoin.createNewTransaction(85, "SENDER_ADDRESS", "RECIPIENT_ADDRESS");
mycoin.createNewTransaction(1300, "SENDER_ADDRESS", "RECIPIENT_ADDRESS");
mycoin.createNewBlock(113, "EEE", "FFF");

console.log(mycoin);
