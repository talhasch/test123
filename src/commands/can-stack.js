const {
  serializeCV,
  cvToString,
  deserializeCV,
  uintCV,
  tupleCV
} = require('@blockstack/stacks-transactions');

const {infoApi, smartContractsApi} = require("../api");

const ui = require("../ui");

const api = require("../api");

const util = require("../util");

const constants = require("../constants");

const main = async (stxAddress, privateKey) => {
  const balance = await api.getAccountBalance(stxAddress);

  const numberOfCycles = await ui.numberInput("Number of cycles:");
  const uStxToLockup = await ui.numberInput("Amount to lockup (uSTX):", balance.stx.balance);

  const poxInfo = await infoApi.getPoxInfo();

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
            ...util.deriveBtcFromStx(stxAddress)
          })
        ).toString('hex')}`,
        `0x${serializeCV(uintCV(uStxToLockup)).toString('hex')}`,
        `0x${serializeCV(uintCV(poxInfo.reward_cycle_id)).toString('hex')}`,
        `0x${serializeCV(uintCV(numberOfCycles)).toString('hex')}`,
      ],
    },
  });

  const rawResp = isEligible.result.slice(2);
  const resp = cvToString(deserializeCV(Buffer.from(rawResp, 'hex')));

  const errMatch = resp.match(/^\(err (\d+)\)$/);
  if (errMatch) {
    const errCode = Number(errMatch[1]);
    const err = constants.POX_ERRORS[errCode]
    console.log(`\n${ui.danger("Not eligible")} ${errCode} - ${err}`);
    return
  }

  console.log(`\n${ui.success("Eligible!")}`);
}

module.exports = main;
