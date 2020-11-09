const {
  makeRandomPrivKey,
  privateKeyToString,
  getAddressFromPrivateKey,
} = require('@blockstack/stacks-transactions');

const c32 = require('c32check');

const constants = require("./constants");

const privateKey = makeRandomPrivKey();
const strPrivateKey = privateKeyToString(privateKey);

const stxAddress = getAddressFromPrivateKey(
  strPrivateKey,
  constants.TRANSACTION_VERSION
);

const btcAddress = c32.c32ToB58(stxAddress);

const obj = {
  privateKey: strPrivateKey,
  address: stxAddress,
  btcAddress
}

console.log(obj);
