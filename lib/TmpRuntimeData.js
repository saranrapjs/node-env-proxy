var fs = require('fs');

var PID_FILE_PATH = './tmp/proxy_env.pid';
var RUNTIME_CONFIG_PATH = './tmp/proxy_config.json';

var TmpRuntimeData = function() {};

TmpRuntimeData.prototype.cleanUpPid = function() {
  try {
    fs.unlink(PID_FILE_PATH);
  } catch (e) {};
}

TmpRuntimeData.prototype.getPid = function() {
  try {
    var pidFileContents = fs.readFileSync(PID_FILE_PATH).toString();
    return parseInt(
      pidFileContents
    );
  } catch (e) {
    return null;
  };
};

TmpRuntimeData.prototype.writePid = function(pid) {
  fs.writeFileSync(PID_FILE_PATH, pid);
};

TmpRuntimeData.prototype.getRuntimeConfig = function() {
  return JSON.parse(
    fs.readFileSync(RUNTIME_CONFIG_PATH).toString()
  );
}

TmpRuntimeData.prototype.writeRuntimeConfig = function(config, options) {
  var urls = {};
  var apps = config.apps;

  for (app in apps) {
    var appConfig = apps[app];
    if (typeof options[app] !== 'undefined') {
      urls[appConfig.proxy] = appConfig[options[app]];
    } else {
      urls[appConfig.proxy] = appConfig[appConfig.default];
    }
  }

  fs.writeFileSync(RUNTIME_CONFIG_PATH, JSON.stringify({
    hostName: options.hostName || config.hostName,
    port: options.port || config.port,
    urls: urls,
  }));
};

TmpRuntimeData.prototype.getHostName = function() {
  return this.getRuntimeConfig().hostName;
}

TmpRuntimeData.prototype.getPort = function() {
  return this.getRuntimeConfig().port;
}

TmpRuntimeData.prototype.getUrls = function() {
  return this.getRuntimeConfig().urls;
}

module.exports = TmpRuntimeData;
