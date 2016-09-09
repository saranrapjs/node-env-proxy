var fs = require('fs');
var EnvProxyFactory = require('./lib/EnvProxyFactory');


var config = JSON.parse(
  fs.readFileSync('./examples/scoop.json').toString()
);

var proxyOptions = {};

for (app in config) {
  var proxy = config[app].proxy;
  var address = config[app][config[app].default];
  proxyOptions[proxy] = address;
}

EnvProxyFactory(proxyOptions);
