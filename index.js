#!/usr/bin/env node

var childProcess = require('child_process');

var child = childProcess.spawn('./server.js', {
  detached: true,
});
