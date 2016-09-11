#!/usr/bin/env node

var EnvProxyFactory = require('./lib/EnvProxyFactory.js');
var TmpRuntimeData = require('./lib/TmpRuntimeData.js');

var tmpData = new TmpRuntimeData();

process.on('SIGINT', function() {
  tmpData.cleanUpPid();
});

EnvProxyFactory({
  hostName: tmpData.getHostName(),
  port: tmpData.getPort(),
  urls: tmpData.getUrls(),
});
