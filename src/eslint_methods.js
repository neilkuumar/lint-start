const fs = require('fs');
const path = require('path');

const { executeCmd } = require('./helpers');
const {
  PROJECT_ROOT,
  ESLINT_CONFIG_FOLDER,
  HAS_REACT,
} = require('./constants');

const ESLINTRC = '.eslintrc';

/**
 * Install eslint and setup config
 */
async function airbnbEslintConfig() {
  await executeCmd('npx install-peerdeps --dev babel-eslint');

  // install airbnb eslint config
  if (HAS_REACT) {
    await executeCmd('npx install-peerdeps --dev eslint-config-airbnb');
  } else {
    await executeCmd('npx install-peerdeps --dev eslint-config-airbnb-base');
  }

  const eslintConfig = HAS_REACT ? `${ESLINTRC}_react` : `${ESLINTRC}_base`;

  // get the eslint config file
  const eslintrcConfig = JSON.parse(
    fs.readFileSync(path.resolve(`${ESLINT_CONFIG_FOLDER}`, eslintConfig)),
  );

  // check for existing .eslintrc
  const eslintFilePath = path.resolve(`${PROJECT_ROOT}`, ESLINTRC);
  const existingEslintrc = fs.existsSync(eslintFilePath);

  // detect user config
  const userConfig = existingEslintrc
    ? JSON.parse(fs.readFileSync(eslintFilePath))
    : {};

  // merge existing config with new config
  const eslint = {
    ...userConfig,
    ...eslintrcConfig,
    rules: {
      ...(userConfig.rules && userConfig.rules),
      ...eslintrcConfig.rules,
    },
  };

  // write new eslintrc file
  fs.writeFileSync(eslintFilePath, JSON.stringify(eslint));

  // format with prettier
  await executeCmd(`npx prettier --write ${eslintFilePath}`);
}

module.exports = {
  airbnbEslintConfig,
};
