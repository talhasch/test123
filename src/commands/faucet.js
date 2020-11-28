const {runFaucetStx} = require("../api");

const {formatTx} = require("../util")

const main = async (stxAddress, privateKey) => {
  try {
    const resp = await runFaucetStx(stxAddress);
    formatTx(resp.txId);
  } catch (e) {
    console.log(e)
  }

}

module.exports = main;
