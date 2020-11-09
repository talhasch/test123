const inquirer = require("inquirer");

const {
  makeContractCall,
  broadcastTransaction,
  uintCV,
  noneCV,
  standardPrincipalCV
} = require('@blockstack/stacks-transactions');

const {getPoxInfo} = require("../api");

const constants = require("../constants");

const {ensurePrivateKey, privateKeyToWallet, stxToMicroStx, formatTx} = require("../util");

const delegate = async (stxAddress, delegateStxAddress, amount, privateKey) => {
  const uAmount = stxToMicroStx(amount);

  console.log(`Address: ${stxAddress}`);
  console.log(`Delegate Address: ${delegateStxAddress}`);
  console.log(`Amount: ${amount} STX - (${uAmount} uStx)`);

  const poxInfo = await getPoxInfo();
  const [contractAddress, contractName] = poxInfo.contract_id.split('.');
  const network = constants.NETWORK;

  const txOptions = {
    contractAddress,
    contractName,
    functionName: 'delegate-stx',
    functionArgs: [
      uintCV(uAmount),
      standardPrincipalCV(delegateStxAddress),
      noneCV(),
      noneCV()
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
      message: "Delegate To:",
      name: "to"
    }])
    .then(answers => {
      return delegate(stxAddress, answers.to, answers.amount, privateKey);
    });
}

const key = ensurePrivateKey();

main(key).then();
