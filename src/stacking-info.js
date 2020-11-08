const numeral = require("numeral");
const chalk = require("chalk");
const countdown = require("countdown")

const {infoApi} = require("./api");

const constants = require("./constants");

const {microStxToStx} = require("./util");

const stackingInfo = async () => {

  const poxInfo = await infoApi.getPoxInfo();
  const coreInfo = await infoApi.getCoreApiInfo();
  const blockTimeInfo = (await infoApi.getNetworkBlockTimes())[constants.NETWORK_STR]

  // Stacking execution
  const stackingExecution = poxInfo.rejection_votes_left_required > 0;
  let label = chalk.cyan("Will Stacking be executed in the next cycle?")
  console.log(`${label} ${stackingExecution ? "Yes" : "No"}`);

  // Cycle duration
  const cycleDuration = poxInfo.reward_cycle_length * blockTimeInfo.target_block_time;
  const cycleDurationMins = cycleDuration / 60;
  const cycleDurationHours = cycleDurationMins / 60;

  label = chalk.cyan("Cycle duration:");
  console.log(`${label} ${cycleDuration} seconds (${cycleDurationMins} minutes) (${cycleDurationHours} hours)`);

  // Minimum to participate
  const minUStx = poxInfo.min_amount_ustx;
  const minStx = microStxToStx(minUStx);

  label = chalk.cyan("Minimum amount required to participate:")
  console.log(`${label} ${minUStx} uSTX (${numeral(minStx).format("0,.00000")} STX)`)

  // When next cycle starts?
  const secondsToNextCycle =
    (poxInfo.reward_cycle_length -
      ((coreInfo.burn_block_height - poxInfo.first_burnchain_block_height) %
        poxInfo.reward_cycle_length)) *
    blockTimeInfo.target_block_time;

  const nextCycleStartingAt = new Date();
  nextCycleStartingAt.setSeconds(nextCycleStartingAt.getSeconds() + secondsToNextCycle);
  const remaining = countdown(nextCycleStartingAt).toString();

  label = chalk.cyan("Next cycle starts in:");
  console.log(`${label} ${nextCycleStartingAt} (in ${remaining})`);
}

const main = async () => {
  return stackingInfo();
}

main().then();
