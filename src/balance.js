const {ensurePrivateKey, privateKeyToWallet, microStxToStx} = require("./util");

const {getAccountBalance} = require("./api");

const balance = async (stxAddress) => {
  console.log(`Address: ${stxAddress}`);

  const resp = await getAccountBalance(stxAddress);

  const uStxBalance = resp.stx.balance;

  console.log(`Balance: ${microStxToStx(uStxBalance)} STX`);
}

const main = async (privateKey) => {
  const {stxAddress} = await privateKeyToWallet(privateKey);
  return balance(stxAddress);
}

const privateKey = ensurePrivateKey();

main(privateKey).then();
