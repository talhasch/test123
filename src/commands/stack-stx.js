const {
  makeContractCall,
  broadcastTransaction,
  uintCV,
  tupleCV
} = require('@blockstack/stacks-transactions');

const {infoApi} = require("../api");

const constants = require("../constants");

const util = require("../util");

const api = require("../api");

const ui = require("../ui");

const {formatTx} = require("../util");

const main = async (stxAddress, privateKey) => {
  const coreInfo = await infoApi.getCoreApiInfo();
  const balance = await api.getAccountBalance(stxAddress);

  const numberOfCycles = await ui.numberInput("Number of cycles:");
  const uStxToLockup = await ui.numberInput("Amount to lockup (uSTX):", balance.stx.balance);
  console.log(`${ui.info(`Current burn block height:`)} ${coreInfo["burn_block_height"]}`);
  const startBurnHt = await ui.numberInput("Start burn height:", coreInfo["burn_block_height"] + 10);

  const poxInfo = await infoApi.getPoxInfo();

  const [contractAddress, contractName] = poxInfo.contract_id.split('.');

  const network = constants.NETWORK;

  const txOptions = {
    contractAddress,
    contractName,
    functionName: 'stack-stx',
    functionArgs: [
      uintCV(uStxToLockup),
      tupleCV({...util.deriveBtcFromStx(stxAddress)}),
      uintCV(startBurnHt),
      uintCV(numberOfCycles)
    ],
    senderKey: privateKey,
    validateWithAbi: true,
    network
  };

  const transaction = await makeContractCall(txOptions);
  const resp = await broadcastTransaction(transaction, network);

  console.log("\n");

  formatTx(resp);
}

module.exports = main;

