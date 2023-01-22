const Blockchain = require("./blockchain");
const { GENESIS_DATA, MINE_RATE } = require("./config");
const cryptohash = require("./cryptoHash");
const hexToBinary = require("hex-to-binary");
class Block {
  constructor({ timestamp, prevHash, hash, data, nonce, difficulty }) {
    this.timestamp = timestamp;
    this.prevHash = prevHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty;
  }
  static genesis() {
    return new this(GENESIS_DATA);
  }

  //block mining
  static mineBlock({ prevBlock, data }) {
    let timestamp, hash;
    const prevHash = prevBlock.hash;
    let { difficulty } = prevBlock;

    let nonce = 0;
    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty({
        originalBlock: prevBlock,
        timestamp,
      });
      hash = cryptohash(timestamp, prevHash, data, nonce, difficulty);
    } while (
      hexToBinary(hash).substring(0, difficulty) !== "0".repeat(difficulty)
    );
    return new this({
      timestamp,
      prevHash,
      data,
      difficulty,
      nonce,
      hash,
    });
  }

  //adjusting difficulty
  static adjustDifficulty({ originalBlock, timestamp }) {
    const { difficulty } = originalBlock;
    if (difficulty < 1) {
      return 1;
    }
    const difference = timestamp - originalBlock.timestamp;
    if (difference > MINE_RATE) {
      return difficulty - 1;
    }
    return difficulty + 1;
  }
}

const block1 = new Block({
  timestamp: "2/1/23",
  prevHash: "0x123",
  hash: "0xa25",
  data: "hello",
});

// const genesisBlock = Block.genesis();
// const result = Block.mineBlock({ prevBlock: block1, data: "block2" });
// console.log(Block.isValidChain(Blockchain.chain));
module.exports = Block;
