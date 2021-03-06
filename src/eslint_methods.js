const fs = require('fs');
const path = require('path');

const { executeCmd } = require('./helpers');
const {
  PROJECT_ROOT,
  ESLINT_CONFIG_FOLDER,
  COMMANDS,
  ESLINTRC,
} = require('./constants');

function getUserEslintRcFilePath() {
  // check for existing .eslintrc
  const eslintFilePath = path.resolve(`${PROJECT_ROOT}`, ESLINTRC);
  const existingEslintrc = fs.existsSync(eslintFilePath);

  return [eslintFilePath, existingEslintrc];
}

function getUserEslintrc() {
  const [eslintFilePath, existingEslintrc] = getUserEslintRcFilePath();

  if (existingEslintrc) {
    return JSON.parse(fs.readFileSync(eslintFilePath));
  }

  return null;
}

/**
 * Install eslint and setup config
 */
async function eslintConfig(hasReact) {
  await executeCmd(COMMANDS.install.babelEslint);
  await executeCmd(COMMANDS.install.eslint.plugin.jest);

  // install airbnb eslint config
  if (hasReact) {
    await executeCmd(COMMANDS.install.eslint.config.airbnb);
  } else {
    await executeCmd(COMMANDS.install.eslint.config.airbnbBase);
  }

  const config = hasReact ? `${ESLINTRC}_react` : `${ESLINTRC}_base`;

  // get the eslint config file
  const eslintrcConfig = JSON.parse(
    fs.readFileSync(path.resolve(`${ESLINT_CONFIG_FOLDER}`, config)),
  );

  // detect user config
  const [eslintFilePath] = getUserEslintRcFilePath();
  const userConfig = getUserEslintrc() || {};

  // TODO: work out the best way to handle existing config
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

async function rmEslintRc() {
  const [eslintFilePath, existingEslintrc] = getUserEslintRcFilePath();
  if (existingEslintrc) {
    fs.rmSync(eslintFilePath);
  }
}

module.exports = {
  eslintConfig,
  getUserEslintrc,
  rmEslintRc,
};
