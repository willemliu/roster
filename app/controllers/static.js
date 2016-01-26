/**
 * Controller for static files and resources
 */
module.exports = function(app, express) {
  console.log("Initialize static controllers");
  app.use("/js", express.static('dist')); // Expose /dist folder as /js
  app.use("/img", express.static('img')); // Expose /img folder as /img
  app.use("/css", express.static('css')); // Expose /css folder as /css
  app.use("/favicon.ico", express.static('img/favicon.ico')); // Expose /favicon.ico as /img/favicon.ico
}