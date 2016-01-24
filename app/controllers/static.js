/**
 * Controller for static files and resources
 */
module.exports = function(app, express) {
  console.log("Initialize static controllers");
  app.use("/js", express.static('dist')); // Expose /js folder as /js
  app.use("/img", express.static('img')); // Expose /js folder as /js
  app.use("/css", express.static('css')); // Expose /js folder as /js
  app.use("/favicon.ico", express.static('img/favicon.ico')); // Expose /js folder as /js
}