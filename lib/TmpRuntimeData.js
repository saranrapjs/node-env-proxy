var fs = require('fs');

var PID_FILE_PATH = './tmp/proxy_env.pid';

var TmpRuntimeData = function() {};

TmpRuntimeData.prototype.getPid = function() {
  if (!fs.statSync(PID_FILE_PATH).isFile()) {
    return null;
  }
  var pidFileContents = fs.readFileSync(PID_FILE_PATH).toString();
  return parseInt(
    pidFileContents
  );
};

TmpRuntimeData.prototype.writePid = function(pid) {
  fs.writeFileSync(PID_FILE_PATH, pid);
};

module.exports = TmpRuntimeData;
