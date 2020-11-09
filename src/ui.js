const chalk = require("chalk");


module.exports = {
  SEPARATOR: chalk.cyan(" ".repeat(60)),
  ALT_SEPARATOR: chalk.cyan("-".repeat(60)),
  label: (s) => chalk.cyan(s)
}
