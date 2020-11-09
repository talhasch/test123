const util = require("./util");
const ui = require("./ui");

const command = [...process.argv].pop();

const init = async () => {
  let privateKey;
  let stxAddress;

  console.log(ui.SEPARATOR);

  if (!["stacking-info"].includes(command)) {
    privateKey = util.ensurePrivateKey();
    ({stxAddress} = await util.privateKeyToWallet(privateKey));
    console.log(`${ui.label("Address")}: ${stxAddress}`);
    console.log(ui.ALT_SEPARATOR);
  }

  let promise = null;

  switch (command) {
    case "stacking-info":
      promise = require("./commands/stacking-info");
      break;
    case "balance":
      promise = require("./commands/balance");
      break;
  }

  if (!promise) {
    return
  }

  promise(stxAddress, privateKey).then(() => {
    console.log(ui.SEPARATOR);
  });
}


init().then();