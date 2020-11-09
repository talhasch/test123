const inquirer = require("inquirer");
const chalk = require("chalk");

const numberInput = (label, def = null) => {
  return inquirer.prompt([
    {
      type: "input",
      message: label,
      name: "value",
      default: def,
      validate: (a) => {
        const n = Number(a);
        if (isNaN(n) || !n) {
          return "Numeric value required!"
        }

        return true;
      }
    }])
    .then(answers => {
      return answers.value
    });
}

module.exports = {
  SEPARATOR: chalk.cyan(" ".repeat(60)),
  ALT_SEPARATOR: chalk.cyan("-".repeat(60)),
  label: (s) => chalk.cyan(s),
  danger: (s) => chalk.red(s),
  success: (s) => chalk.green(s),
  info: (s) => chalk.gray(s),
  numberInput
}
