const {
  serializeCV,
  cvToString,
  deserializeCV,
  standardPrincipalCV
} = require('@blockstack/stacks-transactions');

const {infoApi, smartContractsApi} = require("../api");

const main = async (stxAddress, privateKey) => {

  const poxInfo = await infoApi.getPoxInfo();

  const [contractAddress, contractName] = poxInfo.contract_id.split('.');

  const stackingInfo = await smartContractsApi.callReadOnlyFunction({
    contractAddress,
    contractName,
    functionName: 'get-stacker-info',
    readOnlyFunctionArgs: {
      sender: stxAddress,
      arguments: [`0x${serializeCV(standardPrincipalCV(stxAddress)).toString('hex')}`],
    },
  });

  const response = deserializeCV(Buffer.from(stackingInfo.result.slice(2), 'hex'));

  console.log(response);

  const data = response.value.data;

  console.log({
    lockPeriod: cvToString(data['lock-period']),
    amountSTX: cvToString(data['amount-ustx']),
    firstRewardCycle: cvToString(data['first-reward-cycle']),
    poxAddr: {
      version: cvToString(data['pox-addr'].data.version),
      hashbytes: cvToString(data['pox-addr'].data.hashbytes),
    },
  });

}

module.exports = main
