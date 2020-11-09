const {ensurePrivateKey, privateKeyToWallet} = require("./util");

const {runFaucetStx} = require("./api");

const {formatTx} = require("./util")

const faucet = async (stxAddress) => {
  console.log(`Address: ${stxAddress}`);

  const resp = await runFaucetStx(stxAddress);

  formatTx(resp.txId);
}

const main = async (seed) => {
  const {stxAddress} = privateKeyToWallet(seed);
  return faucet(stxAddress);
}

const seed = ensurePrivateKey();

main(seed).then();
