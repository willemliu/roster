/**
 * Controller for chat
 */
module.exports = function(app, fs, mustache) {
  console.log("Initialize chat controller");

  app.get('/chat', function(req, res) {
    var data = {
      title: 'Chat',
      html_classes: 'chat'
    }; // wrap the data in a global object... (mustache starts from an object then parses)
    var head = fs.readFileSync('templates/partials/head/chat/head.html', "utf8"); // bring in the HEAD
    var body = fs.readFileSync('templates/partials/body/chat/body.html', "utf8"); // bring in the BODY
    var page = fs.readFileSync('templates/main.html', "utf8"); // bring in the main HTML file
    var html = mustache.to_html(page, data, {head: head, body: body}); // replace all of the data
    res.send(html);
  });
}
