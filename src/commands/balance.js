const {formatAmount, microStxToStx} = require("../util");

const {label} = require("../ui");

const {getAccountBalance} = require("../api");

const main = async (stxAddress, privateKey) => {
  const resp = await getAccountBalance(stxAddress);

  const {balance, total_sent, total_received} = resp.stx;

  console.log(`${label("Total received:")} ${formatAmount(microStxToStx(total_received), "STX")}`);
  console.log(`${label("Total Sent:")} ${formatAmount(microStxToStx(total_sent), "STX")}`);
  console.log(`${label("Balance:")} ${formatAmount(microStxToStx(balance), "STX")}`);
}

module.exports = main;
