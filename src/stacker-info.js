const {
  serializeCV,
  cvToString,
  deserializeCV,
  standardPrincipalCV
} = require('@blockstack/stacks-transactions');

const {infoApi, smartContractsApi} = require("./api");

const {ensurePrivateKey, privateKeyToWallet} = require("./util");

const stackerInfo = async (stxAddress) => {
  console.log(`Address: ${stxAddress}`);

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

const main = async (key) => {
  const {stxAddress} = await privateKeyToWallet(key);

  return stackerInfo(stxAddress);
}

const key = ensurePrivateKey();

main(key).then();
