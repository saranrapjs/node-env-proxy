#!/usr/bin/env node

var Table = require('easy-table');

var chalk = require('chalk');
var childProcess = require('child_process');
var path = require('path');
var ps = require('ps');
var q = require('q');
var yargs = require('yargs');

var TmpRuntimeData = require('./lib/TmpRuntimeData.js');

var tmpData = new TmpRuntimeData();
var parsedArgv = yargs.argv;

function startProxy(config, options) {
  child = childProcess.spawn(
    path.resolve(__dirname, './server.js'),
    [JSON.stringify(config)],
    {
      detached: options.debug ? false : true,
      stdio: options.debug ? 'inherit' : 'ignore',
    }
  );

  tmpData.writePid(child.pid);

  if (!options.debug) {
    child.unref();
  }
}

function stopProxy() {
  var pid = tmpData.getPid();
  if (pid !== null) {
    try {
      process.kill(pid);
      console.log(chalk.blue(`Stopped proxy server at pid ${pid}. Goodbye!`));
    } catch (e) {
      console.log(chalk.red(e));
      console.log(chalk.red('Could not find proxy process. Try stopping it manually with `kill` and restart.'));
    }
  } else {
    console.log(chalk.red('Found no information about running proxy server.'));
  }
}

function updateProxy(settings) {
  var pid = tmpData.getPid();

  try { tmpData.updateRuntimeConfig(settings); }
  catch (e) { throw e; }

  try { process.kill(pid, 'SIGHUP'); }
  catch (e) {
    console.log(chalk.red(e));
    console.log(chalk.red('Could not find proxy process. Try stopping it manually with `kill` and restart.'));
  }
}

function checkProxy() {
  return q.Promise(function(resolve, reject, notify) {
    var pid = tmpData.getPid();
    if (!pid) {
      reject(new Error('No running proxy found.'));
      return;
    }

    ps.lookup({ pid: pid }, function(err, resultList) {
      if (!err && resultList) {
        resolve(pid);
      } else {
        reject(new Error('No running proxy found.'));
      }
    })
  })
}

function lsProxy() {
  var status = [];
  var config = tmpData.getRuntimeConfig();
  var table = new Table();

  for (var key in config.apps) {
    table.cell(chalk.cyan('App'), key);
    table.cell(chalk.cyan('Environment'), chalk.green(config.apps[key]));
    table.newRow();
  }

  console.log(table.toString());
}

function reloadConfig() {}

var command = process.argv[2];

module.exports.start = function(config, options) {
  checkProxy()
    .then(function(pid) {
      console.log(chalk.blue('Proxy already running at pid ' + pid + ':\n'));
      lsProxy();
    })
    .catch(function(e) {
      console.log('Starting proxy on port ' + config.port + ' at hostname ' + config.hostName + '...');
      startProxy(config, options);
      setTimeout(function () {
        updateProxy(options);
      }, 500);
    });
}

module.exports.stop = function() {
  stopProxy();
}

module.exports.update = function(settings) {
  updateProxy(settings);
  lsProxy();
}

module.exports.stat = function() {
  checkProxy().then(lsProxy).catch(function(e) {
    console.log(chalk.red(e.message))
  });
}
