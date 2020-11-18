const path = require('path');
const fs = require('fs');
const { COMMANDS, PROJECT_ROOT, ESLINTRC } = require('./constants');
const helpers = require('./helpers');

jest.spyOn(helpers, 'executeCmd').mockImplementation(() => jest.fn());
const methods = require('./eslint_methods');

const eslintFilePath = path.resolve(`${PROJECT_ROOT}`, ESLINTRC);

describe('eslintConfig()', () => {
  it('should execute the correct commands', async () => {
    jest.spyOn(fs, 'existsSync').mockImplementation(() => false);
    jest.spyOn(fs, 'writeFileSync').mockImplementation(() => jest.fn());

    const hasReact = false;

    await methods.eslintConfig(hasReact);

    const commands = helpers.executeCmd.mock.calls.map((calls) => calls[0]);
    expect(commands).toEqual([
      COMMANDS.install.babelEslint,
      COMMANDS.install.eslint.plugin.jest,
      COMMANDS.install.eslint.config.airbnbBase,
      `npx prettier --write ${eslintFilePath}`,
    ]);
  });

  it('should execute the correct commands for react', async () => {
    jest.spyOn(fs, 'existsSync').mockImplementation(() => false);
    jest.spyOn(fs, 'writeFileSync').mockImplementation(() => jest.fn());

    const hasReact = true;
    await methods.eslintConfig(hasReact);

    const commands = helpers.executeCmd.mock.calls.map((calls) => calls[0]);
    expect(commands).toEqual([
      COMMANDS.install.babelEslint,
      COMMANDS.install.eslint.plugin.jest,
      COMMANDS.install.eslint.config.airbnb,
      `npx prettier --write ${eslintFilePath}`,
    ]);
  });

  it('should merge existing eslintrc rules', async () => {
    const mockEslintrc = {
      extends: [
        'eslint:recommended',
        'plugin:prettier/recommended',
        'airbnb-base',
      ],
      plugins: ['jest'],
      parserOptions: {
        ecmaVersion: 2021,
      },
      env: {
        es6: true,
        'jest/globals': true,
      },
      rules: {
        'implicit-arrow-linebreak': 'off',
        'function-paren-newline': 'off',
      },
    };

    const mockExistingEslintrc = {
      plugins: [],
      rules: {
        'implicit-arrow-linebreak': 'off',
        'function-paren-newline': 'off',
        'no-console': 'off',
      },
    };

    const writeFileSync = jest.fn();
    jest.spyOn(fs, 'existsSync').mockImplementation(() => true);
    jest.spyOn(fs, 'writeFileSync').mockImplementation(writeFileSync);
    jest
      .spyOn(fs, 'readFileSync')
      .mockImplementationOnce(() => JSON.stringify(mockEslintrc))
      .mockImplementationOnce(() => JSON.stringify(mockExistingEslintrc));

    const hasReact = true;
    await methods.eslintConfig(hasReact);

    expect(writeFileSync.mock.calls[0][1]).toBe(
      JSON.stringify({
        plugins: ['jest'],
        rules: {
          'implicit-arrow-linebreak': 'off',
          'function-paren-newline': 'off',
          'no-console': 'off',
        },
        extends: [
          'eslint:recommended',
          'plugin:prettier/recommended',
          'airbnb-base',
        ],
        parserOptions: { ecmaVersion: 2021 },
        env: { es6: true, 'jest/globals': true },
      }),
    );
  });
});
