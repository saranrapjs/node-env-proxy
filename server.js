#!/usr/bin/env node

var ConfigReader = require('./lib/ConfigReader.js');
var EnvProxyFactory = require('./lib/EnvProxyFactory.js');

configPath = process.argv[2];
configReader = new ConfigReader(configPath);

var proxyHostName = configReader.getProxyHostName();
var proxyPort = configReader.getProxyPort();
var proxyURLs = configReader.getProxyURLs();

EnvProxyFactory({
  hostName: proxyHostName,
  port: proxyPort,
  urls: proxyURLs,
});
