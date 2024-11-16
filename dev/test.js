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

const previousBlockHash = "AJKSDHKAHDKHASBZXMBCMKHSLKFF564654FD65S4F";
const currentBlockData = [
  {
    amount: 10,
    sender: "SENDER_ADDRESS",
    recipient: "RECIPIENT_ADDRESS",
  },
  {
    amount: 20,
    sender: "SENDER_ADDRESS",
    recipient: "RECIPIENT_ADDRESS",
  },
  {
    amount: 30,
    sender: "SENDER_ADDRESS",
    recipient: "RECIPIENT_ADDRESS",
  },
];
let nonce = 100;
console.log(mycoin.hashBlock(previousBlockHash, currentBlockData, nonce));

nonce = mycoin.proofOfWork(previousBlockHash, currentBlockData);
console.log(mycoin.hashBlock(previousBlockHash, currentBlockData, nonce));

const bc1 = {
  chain: [
    {
      index: 1,
      timestamp: 1731766923891,
      transactions: [],
      nonce: 100,
      hash: "0",
      previousBlockHash: "0",
    },
    {
      index: 2,
      timestamp: 1731766970882,
      transactions: [],
      nonce: 18140,
      hash: "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
      previousBlockHash: "0",
    },
    {
      index: 3,
      timestamp: 1731767075834,
      transactions: [
        {
          amount: 12.5,
          sender: "00",
          recipient: "2c626c008a2641818bcfbb879c8eb562",
          transactionId: "80c1f7df407d4f878551f1e0f472a339",
        },
        {
          amount: 10,
          sender: "BJFGJGSAJKGJKAHKAAS54KJHKJ",
          recipient: "BHJG45JKHKJG45SD6SSDASAS",
          transactionId: "021e9a04cadd451fa125f6fdfce661b2",
        },
        {
          amount: 20,
          sender: "BJFGJGSAJKGJKAHKAAS54KJHKJ",
          recipient: "BHJG45JKHKJG45SD6SSDASAS",
          transactionId: "6e7751181ff940c99cf7fcb6829d23e2",
        },
        {
          amount: 30,
          sender: "BJFGJGSAJKGJKAHKAAS54KJHKJ",
          recipient: "BHJG45JKHKJG45SD6SSDASAS",
          transactionId: "b5e6978446ee4fc0a1341d37612fa047",
        },
      ],
      nonce: 6937,
      hash: "0000356423033d4c816df2b16ca8b67923f2e6412f9487e07a594cca64699c04",
      previousBlockHash:
        "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
    },
    {
      index: 4,
      timestamp: 1731767139954,
      transactions: [
        {
          amount: 12.5,
          sender: "00",
          recipient: "2c626c008a2641818bcfbb879c8eb562",
          transactionId: "3618e66dadfe43449d1496cc827b9853",
        },
        {
          amount: 40,
          sender: "BJFGJGSAJKGJKAHKAAS54KJHKJ",
          recipient: "BHJG45JKHKJG45SD6SSDASAS",
          transactionId: "ab5c60e14c8f4a8b997557927a194da7",
        },
        {
          amount: 50,
          sender: "BJFGJGSAJKGJKAHKAAS54KJHKJ",
          recipient: "BHJG45JKHKJG45SD6SSDASAS",
          transactionId: "4768a918e1ff4bb783d8cdaed3d39679",
        },
        {
          amount: 60,
          sender: "BJFGJGSAJKGJKAHKAAS54KJHKJ",
          recipient: "BHJG45JKHKJG45SD6SSDASAS",
          transactionId: "32d5fe32e9f54161b3aa755578582fa5",
        },
        {
          amount: 70,
          sender: "BJFGJGSAJKGJKAHKAAS54KJHKJ",
          recipient: "BHJG45JKHKJG45SD6SSDASAS",
          transactionId: "2c1b0c24d1944a9990a88b5a7f21ff93",
        },
      ],
      nonce: 15881,
      hash: "00009ba16e990a270874385d4cd8c9293db0a4edc938e16e5b36387929e694d4",
      previousBlockHash:
        "0000356423033d4c816df2b16ca8b67923f2e6412f9487e07a594cca64699c04",
    },
    {
      index: 5,
      timestamp: 1731767152897,
      transactions: [
        {
          amount: 12.5,
          sender: "00",
          recipient: "2c626c008a2641818bcfbb879c8eb562",
          transactionId: "0ce3bfd65974472da4c8a8abd34f3bbe",
        },
      ],
      nonce: 113491,
      hash: "0000593373f2af34ce12ed696f3015e76c1ab3c9cf95d918f456495234df536c",
      previousBlockHash:
        "00009ba16e990a270874385d4cd8c9293db0a4edc938e16e5b36387929e694d4",
    },
    {
      index: 6,
      timestamp: 1731767162709,
      transactions: [
        {
          amount: 12.5,
          sender: "00",
          recipient: "2c626c008a2641818bcfbb879c8eb562",
          transactionId: "b005cc52a8be4bf5a6afd50ef7ae05eb",
        },
      ],
      nonce: 46094,
      hash: "00009ea3b6b29e43bf61b961c27fa3b6222afea49ef49f43cb64dd8c2e3739b4",
      previousBlockHash:
        "0000593373f2af34ce12ed696f3015e76c1ab3c9cf95d918f456495234df536c",
    },
  ],
  pendingTransactions: [
    {
      amount: 12.5,
      sender: "00",
      recipient: "2c626c008a2641818bcfbb879c8eb562",
      transactionId: "81ddd87b62704f2e8b924ada319872df",
    },
  ],
  currentNodeUrl: "http://localhost:3001",
  networkNodes: [],
};

console.log("VALID : ", mycoin.chainIsValid(bc1.chain));
