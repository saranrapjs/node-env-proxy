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
  });

  var server = http.createServer(function(req, res) {
    var urls = options.urls;

    for (var key in urls) {
      if (new urlPattern(key + '*').match(req.url)) {
        console.log(
          `${chalk.yellow(req.url)} -> ${chalk.green(urls[key])}\n`
        );
        proxy.web(req, res, { target: urls[key] });
        break;
      }
    }

  });

  server.listen(options.port);

}

var EnvProxyFactory = function(options) {
  // Options takes the form of obj with key: value pairs of proxy: target
  return new ProxyServer(options);
}

module.exports = EnvProxyFactory;
