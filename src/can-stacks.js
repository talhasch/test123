const inquirer = require("inquirer");

const {
  serializeCV,
  cvToString,
  deserializeCV,
  uintCV,
  tupleCV,
  bufferCV
} = require('@blockstack/stacks-transactions');

const c32 = require('c32check');

const {infoApi, smartContractsApi} = require("./api");

const {ensurePrivateKey, privateKeyToWallet} = require("./util");

const canStack = async (stxAddress, numberOfCycles) => {
  console.log(`Address: ${stxAddress}`);
  console.log(`Cycles: ${numberOfCycles}`);

  const poxInfo = await infoApi.getPoxInfo();

  // microstacks tokens to lockup, must be >= poxInfo.min_amount_ustx and <=accountSTXBalance
  let microstacksoLockup = poxInfo.min_amount_ustx;

  // derive bitcoin address from Stacks account and convert into required format
  const hashbytes = bufferCV(Buffer.from(c32.c32addressDecode(stxAddress)[1], 'hex'));
  const version = bufferCV(Buffer.from('01', 'hex'));

  const [contractAddress, contractName] = poxInfo.contract_id.split('.');

  const isEligible = await smartContractsApi.callReadOnlyFunction({
    contractAddress,
    contractName,
    functionName: 'can-stack-stx',
    readOnlyFunctionArgs: {
      sender: stxAddress,
      arguments: [
        `0x${serializeCV(
          tupleCV({
            hashbytes,
            version,
          })
        ).toString('hex')}`,
        `0x${serializeCV(uintCV(microstacksoLockup)).toString('hex')}`,
        // explicilty check eligibility for next cycle
        `0x${serializeCV(uintCV(poxInfo.reward_cycle_id)).toString('hex')}`,
        `0x${serializeCV(uintCV(numberOfCycles)).toString('hex')}`,
      ],
    },
  });

  const response = cvToString(deserializeCV(Buffer.from(isEligible.result.slice(2), 'hex')));

  if (response.startsWith(`(err `)) {
    // user cannot participate in stacking
    // error codes: https://github.com/blockstack/stacks-blockchain/blob/master/src/chainstate/stacks/boot/pox.clar#L2
    console.log({isEligible: false, errorCode: response});
    return;
  }

  // success
  console.log({isEligible: true});
}

const main = async (key) => {
  const {stxAddress} = await privateKeyToWallet(key);

  return inquirer.prompt([
    {
      type: "input",
      message: "Number of cycles:",
      name: "cycles"
    }])
    .then(answers => {
      return canStack(stxAddress, answers.cycles);
    });
}

const key = ensurePrivateKey();

main(key).then();
