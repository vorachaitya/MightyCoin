const Block = require("./block");
const cryptohash = require("./cryptoHash");

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  //addition of new block
  addBlock({ data }) {
    const newblock = Block.mineBlock({
      prevBlock: this.chain[this.chain.length - 1],
      data,
    });
    this.chain.push(newblock);
  }

  //validation of chain
  static isValidChain(chain) {
    if (JSON.stringify(chain[0]) != JSON.stringify(Block.genesis())) {
      return false;
    }
    for (let i = 1; i < chain.length; i++) {
      const { timestamp, prevHash, hash, data, nonce, difficulty } = chain[i];
      const realLastHash = chain[i - 1].hash;
      const lastDifficulty = chain[i - 1].difficulty;
      if (realLastHash !== prevHash) {
        return false;
      }
      const validateHash = cryptohash(
        timestamp,
        prevHash,
        data,
        nonce,
        difficulty
      );
      if (validateHash !== hash) {
        return false;
      }
      if (Math.abs(lastDifficulty - difficulty) > 1) {
        return false;
      }
      return true;
    }
  }

  //longest chain
  replaceChain(chain) {
    if (chain.length <= this.chain.length) {
      console.error("The incoming chain is not longer");
      return;
    }
    if (!Block.isValidChain(chain)) {
      console.error("The incoming chain ia not valid");
      return;
    }
    this.chain = chain;
  }
}

const blockchain = new Blockchain();
blockchain.addBlock({ data: "block2" });
blockchain.addBlock({ data: "block3" });
console.log(blockchain.chain);
console.log(Blockchain.isValidChain(blockchain.chain));
module.exports = Blockchain;
