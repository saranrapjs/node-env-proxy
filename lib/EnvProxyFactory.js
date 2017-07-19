var chalk = require('chalk'),
  connect = require('connect'),
  https = require('https'),
  http  = require('http'),
  httpProxy = require('http-proxy'),
  urlParse = require('url-parse'),
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

  app = connect()

  if (typeof options.middleware === 'function') {
    app.use(options.middleware);
  }

  app.use(function(req, res) {
    for (var key in this.urls) {
      if (new urlPattern(key + '*').match(req.url)) {
        // Pass the part of the URL that comes after the proxy path pattern
        // to the target; omit the pattern itself
        req.url = req.url.replace(key, '');

        var parsedURL = urlParse(req.url, true);
        var parsedTarget = urlParse(this.urls[key], true);

        // Merge query parameters into the requested URL
        parsedURL.set('query', Object.assign(
          {},
          parsedTarget.query,
          parsedURL.query
        ));

        // Slice off the query from the target, if there is one, now that it's
        // been merged into the requested URL
        parsedTarget.set('query', '');

        req.url = parsedURL.toString();

        console.log(`${parsedURL.toString()} => ${chalk.green(parsedTarget.toString())}`);

        proxy.web(req, res, { target: parsedTarget.toString() });
        break;
      }
    }
  }.bind(this));

  this.server = http.createServer(app)
    .listen(options.port);

  this.server.on('error', function(error) {
    console.log(chalk.bold.red(error));
  });

  proxy.on('error', function(error, req, res, target) {
    console.log(chalk.bold.red(error));
    console.trace();
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
