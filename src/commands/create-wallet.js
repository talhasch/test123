const {
  makeRandomPrivKey,
  privateKeyToString,
  getAddressFromPrivateKey,
} = require('@blockstack/stacks-transactions');

const c32 = require('c32check');

const constants = require("../constants");

const main = async () => {

  const priv = makeRandomPrivKey();
  const strPrivateKey = privateKeyToString(priv);

  const address = getAddressFromPrivateKey(
    strPrivateKey,
    constants.TRANSACTION_VERSION
  );

  const btcAddress = c32.c32ToB58(address);

  const obj = {
    privateKey: strPrivateKey,
    address,
    btcAddress
  }

  console.log(obj);

};

module.exports = main;
