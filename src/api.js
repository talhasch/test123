const fetch = require("cross-fetch");

const {
  InfoApi,
  AccountsApi,
  FaucetsApi,
  SmartContractsApi,
  Configuration
} = require('@stacks/blockchain-api-client');

const constants = require("./constants");

const apiConfig = new Configuration({
  fetchApi: fetch,
  basePath: constants.API_URL,
});

const infoApi = new InfoApi(apiConfig);
const smartContractsApi = new SmartContractsApi(apiConfig);

const getAccountBalance = (principal) => {
  const api = new AccountsApi(apiConfig);
  return api.getAccountBalance({principal})
}

const runFaucetStx = (principal) => {
  const api = new FaucetsApi(apiConfig);
  return api.runFaucetStx({address: principal, stacking:false});
}

module.exports = {
  infoApi,
  smartContractsApi,
  getAccountBalance,
  runFaucetStx
}
