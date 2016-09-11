#!/usr/bin/env node

var chalk = require('chalk');
var childProcess = require('child_process');
var ps = require('ps');

var TmpRuntimeData = require('./lib/TmpRuntimeData.js');

var tmpData = new TmpRuntimeData();

function checkForExistingProcess() {
}

function startProxy(configPath) {
  child = childProcess.spawn(
    './server.js',
    [configPath],
    { detached: false, stdio: 'inherit' }
  );

  tmpData.writePid(child.pid);
}

function stopProxy() {
  var pid = tmpData.getPid();
  if (pid !== null) {
    process.kill(pid);
    console.log(chalk.blue(`Stopped proxy server at pid ${pid}. Goodbye!`));
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

