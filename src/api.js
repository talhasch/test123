const fetch = require("cross-fetch");

const {
  InfoApi,
  AccountsApi,
  FaucetsApi,
  Configuration
} = require('@stacks/blockchain-api-client');

const constants = require("./constants");

const apiConfig = new Configuration({
  fetchApi: fetch,
  basePath: constants.API_URL,
});

const getPoxInfo = () => {
  const api = new InfoApi(apiConfig);
  return api.getPoxInfo();
}

const getAccountBalance = (principal) => {
  const api = new AccountsApi(apiConfig);
  return api.getAccountBalance({principal})
}

const runFaucetStx = (principal) => {
  const api = new FaucetsApi(apiConfig);
  return api.runFaucetStx({address: principal});
}

module.exports = {
  getPoxInfo,
  getAccountBalance,
  runFaucetStx
}
