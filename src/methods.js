const fs = require('fs');
const path = require('path');

const { executeCmd } = require('./helpers');

const ESLINTRC = '.eslintrc';
const PRETTIERRC = '.prettierrc';
const PRETTIERIGNORE = '.prettierignore';
const CONFIG_FOLDER = `${__dirname}/config_files/`;
const PROJECT_ROOT = require.main.paths[0]
  .split('node_modules')[0]
  .slice(0, -1);

async function isGitRepo() {
  return executeCmd('git rev-parse --is-inside-work-tree 2>/dev/null');
}

/**
 * Install eslint and setup config
 */
async function airbnbEslintConfig() {
  // install airbnb eslint config
  await executeCmd('npx install-peerdeps --dev eslint-config-airbnb-base');

  // get the eslint config file
  const eslintrcConfig = JSON.parse(
    fs.readFileSync(path.resolve(`${CONFIG_FOLDER}`, `${ESLINTRC}_base`)),
  );

  // check for existing .eslintrc
  const eslintFilePath = path.resolve(`${PROJECT_ROOT}`, ESLINTRC);
  const existingEslintrc = fs.existsSync(eslintFilePath);

  // merge existing config with new config
  const userConfig = JSON.parse(fs.readFileSync(eslintFilePath));
  const eslint = existingEslintrc
    ? { ...userConfig, ...eslintrcConfig }
    : eslintrcConfig;

  // write new eslintrc file
  fs.writeFileSync(eslintFilePath, JSON.stringify(eslint));

  // format with prettier
  await executeCmd(`npx prettier --write ${eslintFilePath}`);
}

/**
 * Install prettier eslint config
 */
async function prettierEslintConfig() {
  // install prettier eslint config
  await executeCmd('npm install --save-dev eslint-config-prettier');
}

/**
 * Install prettier and setup config
 */
async function prettierSetup() {
  try {
    // install prettier
    await executeCmd('npm install --save-dev --save-exact prettier');

    // check if user already has created .prettierrc
    const prettierrc = fs.existsSync(
      path.resolve(`${PROJECT_ROOT}`, PRETTIERRC),
    );

    if (!prettierrc) {
      // get the prettier config file
      const prettierConfigFile = path.resolve(
        `${CONFIG_FOLDER}`,
        `${PRETTIERRC}`,
      );

      await executeCmd(`chmod -R 755 ${prettierConfigFile}`);

      fs.copyFileSync(
        prettierConfigFile,
        path.resolve(`${PROJECT_ROOT}`, PRETTIERRC),
      );
    }

    // check if user already has created .prettierignore
    const prettierignore = fs.existsSync(
      path.resolve(`${PROJECT_ROOT}`, PRETTIERIGNORE),
    );

    if (!prettierignore) {
      const filename = '.prettierignore';
      const file = path.resolve(`${CONFIG_FOLDER}`, filename);

      // give read and write access to the file
      await executeCmd(`chmod -R 755 ${file}`);

      fs.copyFileSync(file, path.resolve(`${PROJECT_ROOT}`, filename));
    }
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  isGitRepo,
  airbnbEslintConfig,
  prettierEslintConfig,
  prettierSetup,
};
