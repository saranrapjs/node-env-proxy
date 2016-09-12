#!/usr/bin/env node

var EnvProxyFactory = require('./lib/EnvProxyFactory.js');
var TmpRuntimeData = require('./lib/TmpRuntimeData.js');

var tmpData = new TmpRuntimeData();
var proxy;

process.on('SIGINT', function() {
  tmpData.cleanUpPid();
  process.exit();
});

process.on('SIGHUP', function() {
  proxy.close(function() {
    proxy = EnvProxyFactory({
      hostName: tmpData.getHostName(),
      port: tmpData.getPort(),
      urls: tmpData.getUrls(),
    });
  });
});

proxy = EnvProxyFactory({
  hostName: tmpData.getHostName(),
  port: tmpData.getPort(),
  urls: tmpData.getUrls(),
});
