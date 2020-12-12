#!/usr/bin/env node

const { setup, uninstall } = require('./src/main');

const args = process.argv.slice(2);

const shouldUninstall = args.includes('--uninstall');

function run() {
  if (shouldUninstall) {
    return uninstall();
  }

  return setup();
}

run();
