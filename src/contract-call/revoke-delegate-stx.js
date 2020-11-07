const {
  makeContractCall,
  broadcastTransaction,
} = require('@blockstack/stacks-transactions');

const {ensurePrivateKey, privateKeyToWallet, formatTx} = require("../util");

const {getPoxInfo} = require("../api");

const constants = require("../constants");

const revoke = async (stxAddress, privateKey) => {
  console.log(`Address: ${stxAddress}`);

  const poxInfo = await getPoxInfo();
  const [contractAddress, contractName] = poxInfo.contract_id.split('.');
  const network = constants.NETWORK

  const txOptions = {
    contractAddress,
    contractName,
    functionName: 'revoke-delegate-stx',
    functionArgs: [],
    senderKey: privateKey,
    validateWithAbi: true,
    network
  };

  const transaction = await makeContractCall(txOptions);
  const resp = await broadcastTransaction(transaction, network);

  formatTx(resp);
}

const main = async (key) => {
  const {stxAddress, privateKey} = await privateKeyToWallet(key);
  return revoke(stxAddress, privateKey);
}

const key = ensurePrivateKey();

main(key).then();
