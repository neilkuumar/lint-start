const fs = require('fs');
const path = require('path');

const { executeCmd } = require('./helpers');
const chalk = require('./chalk');

const ESLINTRC = '.eslintrc';
const PRETTIERRC = '.prettierrc';
const PRETTIERIGNORE = '.prettierignore';
const PACKAGEJSON = 'package.json';
const REACT = 'react';
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
  // check if the project is using react
  const packagePath = path.resolve(`${PROJECT_ROOT}`, PACKAGEJSON);
  const packageExists = fs.existsSync(packagePath);

  if (!packageExists) throw new Error(chalk.error('No package.json detected!'));

  const packageJson = JSON.parse(fs.readFileSync(packagePath));

  const { dependencies, devDependencies } = packageJson;
  const allDependencies = { ...dependencies, ...devDependencies };

  const hasReact = Object.keys(allDependencies).some((dep) => dep === REACT);

  // install airbnb eslint config
  if (hasReact) {
    await executeCmd('npx install-peerdeps --dev eslint-config-airbnb');
  } else {
    await executeCmd('npx install-peerdeps --dev eslint-config-airbnb-base');
  }

  const eslintConfig = hasReact ? `${ESLINTRC}_react` : `${ESLINTRC}_base`;

  // get the eslint config file
  const eslintrcConfig = JSON.parse(
    fs.readFileSync(path.resolve(`${CONFIG_FOLDER}`, eslintConfig)),
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
    const prettierrcFilePath = path.resolve(`${PROJECT_ROOT}`, PRETTIERRC);
    const prettierrc = fs.existsSync(prettierrcFilePath);

    if (!prettierrc) {
      // get the prettier config file
      const prettierConfigFile = path.resolve(
        `${CONFIG_FOLDER}`,
        `${PRETTIERRC}`,
      );

      await executeCmd(`chmod -R 755 ${prettierConfigFile}`);

      fs.copyFileSync(prettierConfigFile, prettierrcFilePath);
    }

    // check if user already has created .prettierignore
    const prettierignoreFilePath = path.resolve(
      `${PROJECT_ROOT}`,
      PRETTIERIGNORE,
    );
    const prettierignoreExists = fs.existsSync(prettierignoreFilePath);

    if (!prettierignoreExists) {
      const filename = PRETTIERIGNORE;
      const file = path.resolve(`${CONFIG_FOLDER}`, filename);

      // give read and write access to the file
      await executeCmd(`chmod -R 755 ${file}`);

      fs.copyFileSync(file, prettierignoreFilePath);
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
