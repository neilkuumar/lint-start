const util = require("util");
const exec = util.promisify(require("child_process").exec);

async function executeCmd(command) {
  try {
    const { stdout } = await exec(command);
    return stdout;
  } catch (e) {
    console.error(e);
    return e;
  }
}

module.exports = { executeCmd };
