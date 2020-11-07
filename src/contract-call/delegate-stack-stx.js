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

const callContract = async (stxAddress, stackerStxAddress, amount, privateKey) => {
  const uAmount = stxToMicroStx(amount);

  console.log(`Address: ${stxAddress}`);
  console.log(`Stacker: ${stackerStxAddress}`);
  console.log(`Amount: ${amount} STX - (${uAmount} uStx)`);

  // derive bitcoin address from Stacks account and convert into required format
  const hashbytes = bufferCV(Buffer.from(c32.c32addressDecode(stxAddress)[1], 'hex'));
  const version = bufferCV(Buffer.from('01', 'hex'));

  const coreInfo = await infoApi.getCoreApiInfo();
  const poxInfo = await infoApi.getPoxInfo();

  const [contractAddress, contractName] = poxInfo.contract_id.split('.');

  const network = constants.NETWORK;

  const lockPeriod = 10;

  const txOptions = {
    contractAddress,
    contractName,
    functionName: 'delegate-stack-stx',
    functionArgs: [
      standardPrincipalCV(stackerStxAddress),
      uintCV(uAmount),
      tupleCV({
        hashbytes,
        version,
      }),
      uintCV(coreInfo["burn_block_height"] + 10),
      uintCV(lockPeriod)
    ],
    senderKey: privateKey,
    validateWithAbi: false,
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
      message: "Stacker:",
      name: "stacker"
    },
    {
      type: "input",
      message: "Amount:",
      suffix: "(STX)",
      name: "amount"
    }])
    .then(answers => {
      return callContract(stxAddress, answers.stacker, answers.amount, privateKey);
    });
}

const key = ensurePrivateKey();

main(key).then();
