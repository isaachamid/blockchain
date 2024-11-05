const Blockchain = require("./blockchain");

const mycoin = new Blockchain();
mycoin.createNewBlock(111, "AAA", "BBB");
mycoin.createNewBlock(112, "CCC", "DDD");
mycoin.createNewBlock(113, "EEE", "FFF");
console.log(mycoin);
