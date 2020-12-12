const util = require('util');
const childProcess = require('child_process');
const path = require('path');
const fs = require('fs');

const ora = require('ora');
const chalk = require('./chalk_helper');
const { COMMANDS, PROJECT_ROOT, PACKAGEJSON, REACT } = require('./constants');

const exec = util.promisify(childProcess.exec);

/**
 * Executes a shell command
 * @param {String} command
 * @returns {Promise}
 */
async function executeCmd(command) {
  const { stdout } = await exec(command);
  return stdout;
}

/**
 * Returns true if a project is a git repo
 * @returns {Boolean}
 */
async function isGitRepo() {
  return executeCmd(COMMANDS.isGitRepo);
}

async function uninstallDeps() {
  return executeCmd(COMMANDS.uninstall);
}

/**
 * Runs an action with a spinner
 * @param {Object} action
 * @param {Function} action.action action to run
 * @param {String} action.text string to log
 */
async function runAction({ action, text }) {
  const spinner = ora(`${chalk.action(text)}`).start();
  try {
    await action();
    spinner.succeed();
  } catch (error) {
    spinner.fail();
    throw error;
  }
}

function getPackageJson() {
  const packagePath = path.resolve(`${PROJECT_ROOT}`, PACKAGEJSON);
  const packageExists = fs.existsSync(packagePath);

  if (!packageExists) {
    throw new Error(
      chalk.error(
        'No package.json detected! Please run this from the project root directory.',
      ),
    );
  }

  return packagePath;
}

/**
 * Returns true if the repo has react as a dependency
 */
function doesProjectHaveReact() {
  const packagePath = getPackageJson();
  const packageJson = JSON.parse(fs.readFileSync(packagePath));

  // merge all dependencies incase user has installed in wrong location
  const { dependencies, devDependencies } = packageJson;
  const allDependencies = { ...dependencies, ...devDependencies };

  // check if react is included
  const hasReact = Object.keys(allDependencies).some((dep) => dep === REACT);

  return hasReact;
}

module.exports = {
  executeCmd,
  isGitRepo,
  runAction,
  doesProjectHaveReact,
  uninstallDeps,
  getPackageJson,
};
