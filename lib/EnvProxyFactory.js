var chalk = require('chalk');
  https = require('https'),
  http  = require('http'),
  httpProxy = require('http-proxy'),
  urlPattern = require('url-pattern');

var ProxyServer = function(options) {

  var proxy = httpProxy.createProxyServer({
    autoRewrite: true,
    hostRewrite: `${options.hostName}:${options.port}`,
    protocolRewrite: 'http',
    changeOrigin: true,
    ws: true,
  });

  this.urls = options.urls;
  this.server = http.createServer(function(req, res) {
    for (var key in this.urls) {
      if (new urlPattern(key + '*').match(req.url)) {
        console.log(
          `${chalk.yellow(req.url)} -> ${chalk.green(this.urls[key])}\n`
        );
        req.url = req.url.replace(key, '');
        proxy.web(req, res, { target: this.urls[key] });
        break;
      }
    }
  }.bind(this));

  this.server.listen(options.port);
  this.server.on('error', function(error) {
    console.log(chalk.bold.red(error));
  });
  proxy.on('error', function(error) {
    console.log(chalk.bold.red(error));
  });
}

ProxyServer.prototype.close = function(cb) {
  this.server.close(cb);
}

ProxyServer.prototype.setUrls = function(urls) {
  this.urls = urls;
}

var EnvProxyFactory = function(options) {
  // Options takes the form of obj with key: value pairs of proxy: target
  return new ProxyServer(options);
}

module.exports = EnvProxyFactory;
