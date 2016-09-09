var https = require('https'),
  http  = require('http'),
  httpProxy = require('http-proxy'),
  urlPattern = require('url-pattern');

var ProxyServer = function(options) {

  var proxy = httpProxy.createProxyServer({
    autoRewrite: true,
    hostRewrite: 'localhost:8889',
    protocolRewrite: 'http',
    changeOrigin: true,
  });

  var server = http.createServer(function(req, res) {

    for (var key in options) {
      if (new urlPattern(key + '*').match(req.url)) {
        console.log(req.url);
        console.log(options[key]);
        console.log('________');
        proxy.web(req, res, { target: options[key] });
        break;
      }
    }

  });

  server.listen(8889);

}

var EnvProxyFactory = function(options) {
  // Options takes the form of obj with key: value pairs of proxy: target
  return new ProxyServer(options);
}

module.exports = EnvProxyFactory;
