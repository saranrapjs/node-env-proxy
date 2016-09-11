#!/usr/bin/env node

var chalk = require('chalk');
var childProcess = require('child_process');
var ps = require('ps');
var yargs = require('yargs');

var ConfigReader = require('./lib/ConfigReader.js');
var TmpRuntimeData = require('./lib/TmpRuntimeData.js');

var tmpData = new TmpRuntimeData();
var parsedArgv = yargs.argv;

function checkForExistingProcess() {
}

function startProxy(configPath) {
  configReader = new ConfigReader(configPath);

  try {
    tmpData.writeRuntimeConfig(
      configReader.getConfigObj(),
      parsedArgv
    );
  } catch (e) {
    throw e;
  }

  child = childProcess.spawn(
    './server.js',
    { detached: false, stdio: 'inherit' }
  );

  tmpData.writePid(child.pid);
}

function stopProxy() {
  var pid = tmpData.getPid();
  if (pid !== null) {
    try {
      process.kill(pid);
      console.log(chalk.blue(`Stopped proxy server at pid ${pid}. Goodbye!`));
    } catch (e) {
      console.log(chalk.red('Could not find proxy process. Try stopping it manually with `kill` and restart.'));
    }
  } else {
    console.log(chalk.red('Found no information about running proxy server.'));
  }
}

function reloadConfig() {}

var command = process.argv[2];

switch (command) {
  case 'start': {
    startProxy(process.argv[3]);
    break;
  }
  case 'stop': {
    stopProxy();
    break;
  }
}

