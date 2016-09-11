#!/usr/bin/env node

var EnvProxyFactory = require('./lib/EnvProxyFactory.js');
var TmpRuntimeData = require('./lib/TmpRuntimeData.js');

var tmpData = new TmpRuntimeData();

EnvProxyFactory({
  hostName: tmpData.getHostName(),
  port: tmpData.getPort(),
  urls: tmpData.getUrls(),
});
