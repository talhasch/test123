

const {deriveRootKeychainFromMnemonic, deriveStxAddressChain} = require("@stacks/keychain");
const {ChainID} = require("@stacks/transactions");

const fetch = require('cross-fetch');
const BN = require('bn.js');
const {
  makeRandomPrivKey,
  privateKeyToString,
  getAddressFromPrivateKey,
  TransactionVersion,
  StacksTestnet,
  uintCV,
  tupleCV,
  makeContractCall,
  bufferCV,
  serializeCV,
  deserializeCV,
  cvToString,
  connectWebSocketClient,
  broadcastTransaction,
  standardPrincipalCV,
} = require('@blockstack/stacks-transactions');

const {ensureSeed} = require("./util");


const {
  InfoApi,
  AccountsApi,
  SmartContractsApi,
  Configuration,
  TransactionsApi,
} = require('@stacks/blockchain-api-client');
const c32 = require('c32check');


const apiConfig = new Configuration({
  fetchApi: fetch,
  basePath: 'https://stacks-node-api.blockstack.org',
});

const seed = ensureSeed();

//---------------------------


const main = async () => {

  /*
 // generate rnadom key
 const privateKey = makeRandomPrivKey();

// get Stacks address
 const stxAddress = getAddressFromPrivateKey(
   privateKeyToString(privateKey),
   TransactionVersion.Testnet
 );
 console.log(stxAddress);
 console.log(privateKey.toString())
 */

  console.log(`Seed: ${seed}`);
  const rootNode = await deriveRootKeychainFromMnemonic(seed);
  const {address: stxAddress, privateKey} = deriveStxAddressChain(ChainID.Testnet)(rootNode);
  const btcAddress = c32.c32ToB58(stxAddress);

  console.log(`STX Address: ${stxAddress}`);
  console.log(`BTC Address: ${btcAddress}`);

  const hashBytes = bufferCV(Buffer.from(c32.c32addressDecode(stxAddress)[1], 'hex'));
  const version = bufferCV(Buffer.from('01', 'hex'));
  const poxAddr = tupleCV({
    hashBytes,
    version,
  });
  console.log(hashBytes);
  console.log(version);
  console.log(poxAddr)
}

main().then()
