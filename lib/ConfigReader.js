var fs = require('fs');

var ConfigReader = function(fileName) {
  this.fileName = fileName;
}

ConfigReader.prototype.getConfigObj = function() {
  if (!this.configObj) {
    this.configObj = JSON.parse(
      fs.readFileSync(this.fileName).toString()
    );
  }

  return this.configObj;
}

ConfigReader.prototype.getProxyHostName = function() {
  return this.getConfigObj().hostName;
}
ConfigReader.prototype.getProxyPort = function() {
  return this.getConfigObj().port;
}

ConfigReader.prototype.getProxyURLs = function() {
  var config = this.getConfigObj().apps;

  var proxyOptions = {};

  for (app in config) {
    var proxy = config[app].proxy;
    var address = config[app][config[app].default];
    proxyOptions[proxy] = address;
  }

  return proxyOptions;
}

module.exports = ConfigReader;
