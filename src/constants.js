const {
  StacksTestnet,
  TransactionVersion
} = require('@blockstack/stacks-transactions');

const STX_MULTIPLIER = 1000000;
const API_URL = "https://stacks-node-api.blockstack.org";

module.exports = {
  STX_MULTIPLIER,
  API_URL,
  NETWORK_STR: 'testnet',
  NETWORK: new StacksTestnet(),
  TRANSACTION_VERSION: TransactionVersion.Testnet
}
