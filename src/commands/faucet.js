const {runFaucetStx} = require("../api");

const {formatTx} = require("../util")

const main = async (stxAddress, privateKey) => {
  const resp = await runFaucetStx(stxAddress);
  formatTx(resp.txId);
}

module.exports = main;
