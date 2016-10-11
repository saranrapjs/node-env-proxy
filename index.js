#!/usr/bin/env node

require('console.table');

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
    { detached: true }
  );

  child.unref();
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

function updateProxy(configPath) {
  var configReader = new ConfigReader(configPath);
  var pid = tmpData.getPid();

  try {
    tmpData.writeRuntimeConfig(
      configReader.getConfigObj(),
      parsedArgv
    );
  } catch (e) {
    throw e;
  }

  try {
    process.kill(pid, 'SIGHUP');
  } catch (e) {
    console.log(chalk.red('Could not find proxy process. Try stopping it manually with `kill` and restart.'));
  }
}

function lsProxy() {
  let status = [];
  let config = tmpData.getRuntimeConfig();
  for (key in config.urls) {
    status.push({ proxy: key, target: chalk.green(config.urls[key]) });
  }
  console.table(status);
}

function reloadConfig() {}

var command = process.argv[2];

switch (command) {
  case 'start': {
    startProxy(process.argv[3]);
    lsProxy();
    process.stdout.end();
    break;
  }
  case 'stop': {
    stopProxy();
    break;
  }
  case 'update': {
    updateProxy(process.argv[3]);
    lsProxy();
    process.stdout.end();
    break;
  }
  case 'stat': {
    lsProxy();
    break;
  }
}
