const inquirer = require("inquirer");

const {
  makeContractCall,
  broadcastTransaction,
  uintCV,
  tupleCV,
  bufferCV,
  standardPrincipalCV
} = require('@blockstack/stacks-transactions');

const c32 = require('c32check');

const {infoApi} = require("../api");

const constants = require("../constants");

const {ensurePrivateKey, privateKeyToWallet, stxToMicroStx, formatTx} = require("../util");

const callContract = async (stxAddress, amount, numberOfCycles, privateKey) => {
  const uAmount = stxToMicroStx(amount);

  console.log(`Address: ${stxAddress}`);
  console.log(`numberOfCycles: ${numberOfCycles}`);
  console.log(`Amount: ${amount} STX - (${uAmount} uStx)`);

  // derive bitcoin address from Stacks account and convert into required format
  const hashbytes = bufferCV(Buffer.from(c32.c32addressDecode(stxAddress)[1], 'hex'));
  const version = bufferCV(Buffer.from('01', 'hex'));

  const coreInfo = await infoApi.getCoreApiInfo();
  const poxInfo = await infoApi.getPoxInfo();

  const [contractAddress, contractName] = poxInfo.contract_id.split('.');

  const network = constants.NETWORK;

  const txOptions = {
    contractAddress,
    contractName,
    functionName: 'stack-stx',
    functionArgs: [
      uintCV(uAmount),
      tupleCV({
        hashbytes,
        version,
      }),
      uintCV(coreInfo["burn_block_height"] + 10),
      uintCV(numberOfCycles)
    ],
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

  return inquirer.prompt([
    {
      type: "input",
      message: "Amount:",
      suffix: "(STX)",
      name: "amount"
    },
    {
      type: "input",
      message: "Number of cycles:",
      name: "cycles"
    }])
    .then(answers => {
      return callContract(stxAddress, answers.amount, answers.cycles, privateKey);
    });
}

const key = ensurePrivateKey();

main(key).then();
