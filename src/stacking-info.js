const countdown = require("countdown")

const {infoApi} = require("./api");

const constants = require("./constants");

const ui = require("./ui");

const util = require("./util");

const stackingInfo = async () => {
  const poxInfo = await infoApi.getPoxInfo();
  const coreInfo = await infoApi.getCoreApiInfo();
  const blockTimeInfo = (await infoApi.getNetworkBlockTimes())[constants.NETWORK_STR];

  console.log(ui.SEPARATOR);

  // Stacking execution for next cycle
  const stackingExecution = poxInfo.rejection_votes_left_required > 0;
  console.log(`${ui.label("Will Stacking be executed in the next cycle?")} ${stackingExecution ? "Yes" : "No"}`);

  // Cycle duration.
  const durationSecs = poxInfo.reward_cycle_length * blockTimeInfo.target_block_time;
  const durationMins = durationSecs / 60;
  const durationHours = durationMins / 60;
  console.log(`${ui.label("Cycle duration:")} ${durationSecs} seconds (${durationMins} minutes) (${durationHours} hours)`);

  // Minimum to participate.
  const minUStx = poxInfo.min_amount_ustx;
  const minStx = util.microStxToStx(minUStx);
  console.log(`${ui.label("Minimum amount required to participate:")} ${minUStx} uSTX (${util.formatAmount(minStx)} STX)`)

  // When next cycle starts?
  const blockHeightDiff = coreInfo.burn_block_height - poxInfo.first_burnchain_block_height;
  const lengthMod = blockHeightDiff % poxInfo.reward_cycle_length;
  const secondsToNextCycle = (poxInfo.reward_cycle_length - lengthMod) * blockTimeInfo.target_block_time;

  const nextCycleStartingAt = new Date();
  nextCycleStartingAt.setSeconds(nextCycleStartingAt.getSeconds() + secondsToNextCycle);
  const remaining = countdown(nextCycleStartingAt).toString();

  console.log(`${ui.label("Next cycle starts in:")} ${nextCycleStartingAt} (in ${remaining})`);

  console.log(ui.SEPARATOR);
}

const main = async () => {
  return stackingInfo();
}

main().then();
