const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://radiant-basin-02631.herokuapp.com', // Replace this with your Heroku app URL
      changeOrigin: true,
    })
  );
};
