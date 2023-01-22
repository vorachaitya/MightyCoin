const crypto = require("crypto");

const cryptohash = (...inputs) => {
  const hash = crypto.createHash("sha256");
  hash.update(inputs.sort().join(""));
  return hash.digest("hex");
};

result = cryptohash("hello", "world");
module.exports = cryptohash;
