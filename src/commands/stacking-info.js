const countdown = require("countdown")

const {infoApi} = require("../api");

const constants = require("../constants");

const {label} = require("../ui");

const {microStxToStx, formatAmount} = require("../util");

const main = async () => {

  const height = 3120;

  const poxInfo = await infoApi.getPoxInfo();
  const coreInfo = await infoApi.getCoreApiInfo();
  const blockTimeInfo = (await infoApi.getNetworkBlockTimes())[constants.NETWORK_STR];

  // block number to cycle
  const b = (height - poxInfo.first_burnchain_block_height) / poxInfo.reward_cycle_length;
  console.log(b);

  // cycle to block num

  // return

  // Stacking execution for next cycle
  const stackingExecution = poxInfo.rejection_votes_left_required > 0;
  console.log(`${label("Will Stacking be executed in the next cycle?")} ${stackingExecution ? "Yes" : "No"}`);

  // Cycle duration.
  const durationSecs = poxInfo.reward_cycle_length * blockTimeInfo.target_block_time;
  const durationMins = durationSecs / 60;
  const durationHours = durationMins / 60;
  console.log(`${label("Cycle duration:")} ${durationSecs} seconds (${durationMins} minutes) (${durationHours} hours)`);

  // Minimum to participate.
  const minUStx = poxInfo.min_amount_ustx;
  const minStx = microStxToStx(minUStx);
  console.log(`${label("Minimum amount required to participate:")} ${minUStx} uSTX (${formatAmount(minStx, "STX")})`)

  // When next cycle starts?
  const blockHeightDiff = coreInfo.burn_block_height - poxInfo.first_burnchain_block_height;
  const lengthMod = blockHeightDiff % poxInfo.reward_cycle_length;
  const secondsToNextCycle = (poxInfo.reward_cycle_length - lengthMod) * blockTimeInfo.target_block_time;

  const nextCycleStartingAt = new Date();
  nextCycleStartingAt.setSeconds(nextCycleStartingAt.getSeconds() + secondsToNextCycle);
  const remaining = countdown(nextCycleStartingAt).toString();
  console.log(`${label("Next cycle starts in:")} ${nextCycleStartingAt} (in ${remaining})`);

  const nextCycleFirstBlockNum = coreInfo.burn_block_height + (secondsToNextCycle / blockTimeInfo.target_block_time);
  if (!(nextCycleFirstBlockNum % blockTimeInfo.target_block_time === 0)) {
    throw "nextCycleFirstBlockNum is not correct"
  }
  console.log(`${label("First block number of next cycle:")} ${nextCycleFirstBlockNum}`);
}

module.exports = main;

