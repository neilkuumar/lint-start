const childProcess = require('child_process');
const ora = require('ora');
const chalk = require('./chalk_helper');
const { COMMANDS } = require('./constants');
const helpers = require('./helpers');

jest.mock('child_process');
jest.mock('ora');

describe('executeCmd', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('should handle a successful command', () => {
    const cmd = 'execute order 66';
    helpers.executeCmd(cmd);
    expect(childProcess.exec.mock.calls[0][0]).toBe(cmd);
  });

  it('should handle a failed command', () => {
    const cmd = 'execute order 66';
    const expectedError = 'NEVER!';
    childProcess.exec.mockImplementation(() => {
      throw new Error(expectedError);
    });

    const consoleError = console.error;
    console.error = jest.fn();

    try {
      helpers.executeCmd(cmd);
    } catch (error) {
      expect(childProcess.exec.mock.calls[0][0]).toBe(cmd);
      expect(error).toBe(expectedError);
      console.error = consoleError;
    }
  });
});

describe('isGitRepo()', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('should execute the correct commands', async () => {
    helpers.isGitRepo();
    expect(childProcess.exec.mock.calls[0][0]).toBe(COMMANDS.isGitRepo);
  });
});

describe('runAction()', () => {
  const stopAndPersist = jest.fn();

  beforeEach(() => {
    ora.mockImplementation(() => ({
      start: jest.fn(() => ({
        stop: jest.fn(),
        stopAndPersist,
      })),
    }));
  });

  it('should handle a successful action', async () => {
    const action = jest.fn();
    const text = 'Success!';

    await helpers.runAction({ action, text });

    expect(ora).toHaveBeenCalledWith(chalk.action(text));
    expect(action).toHaveBeenCalledTimes(1);
    expect(stopAndPersist).toHaveBeenCalledWith({ symbol: '✅' });
  });

  it('should handle a failed action', async () => {
    const action = jest.fn(() => {
      throw new Error();
    });
    const text = 'Error!';

    try {
      await helpers.runAction({ action, text });
    } catch (error) {
      expect(ora).toHaveBeenCalledWith(chalk.action(text));
      expect(action).toHaveBeenCalledTimes(1);
      expect(stopAndPersist).toHaveBeenCalledWith({ symbol: '❌' });
    }
  });
});
