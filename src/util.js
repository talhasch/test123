const numeral = require("numeral");

const {getAddressFromPrivateKey, bufferCV} = require("@blockstack/stacks-transactions");

const c32 = require('c32check');

const constants = require("./constants");

const ensurePrivateKey = () => {
  const key = process.env.PRIV;

  if (!key) {
    console.error("PRIV env required!");
    process.exit(1);
  }

  return key;
}

const privateKeyToWallet = (privateKey) => {
  const stxAddress = getAddressFromPrivateKey(
    privateKey,
    constants.TRANSACTION_VERSION
  );

  const btcAddress = c32.c32ToB58(stxAddress);

  return {
    stxAddress,
    btcAddress,
    privateKey,
  }
}

const stxToMicroStx = (stx) => {
  return stx * constants.STX_MULTIPLIER;
}

const microStxToStx = (microStx) => {
  return microStx / constants.STX_MULTIPLIER;
}

const formatAmount = (a, suffix = "") => {
  const formatted = numeral(a).format("0,.00000");
  return `${formatted} ${suffix}`.trim();
}

const formatTx = (resp) => {
  if (typeof resp === "string") {
    console.log("Done 👍");
    const txId = resp.startsWith("0x") ? resp : `0x${resp}`;
    const txUrl = `${constants.API_URL}/extended/v1/tx/${txId}`;
    console.log(txUrl);
    const eTxUrl = `https://testnet-explorer.blockstack.org/txid/${txId}`;
    console.log(eTxUrl);
    return;
  }

  console.log(resp);
}

const deriveBtcFromStx = (stxAddress) => {
  // derive bitcoin address from Stacks account and convert into required format
  const hashbytes = bufferCV(Buffer.from(c32.c32addressDecode(stxAddress)[1], 'hex'));
  const version = bufferCV(Buffer.from('01', 'hex'));

  return {hashbytes, version}
}

module.exports = {
  ensurePrivateKey, privateKeyToWallet, stxToMicroStx, microStxToStx, formatAmount, formatTx, deriveBtcFromStx
}
