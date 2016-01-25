/**
 * Controller for Roster
 */
module.exports = function(app, fs, mustache, mysql) {
  console.log("Initialize Roster controller");

  var data = {
    title: 'Roster',
    html_classes: 'roster',
    dates: []
  }; // wrap the data in a global object... (mustache starts from an object then parses)
  
  initDates();
  
  app.get('/', function(req, res){ // INDEX
    getUsers([], function() {
      renderHtml(res, 'roster', data);
    });    
  });
  
  app.get('/:slug', function(req, res){ // get the url and slug info
    var slug =[req.params.slug][0]; // grab the page slug
    
    getUsers([], function() {
      renderHtml(res, slug, data);
    });
    
  });
  
  function initDates() {
    var today = new Date();
    var theDate = new Date();
    while (theDate.getDay() != 1) {
      theDate.setDate(theDate.getDate() - 1); // Set to yesterday
    }
    for(var i = 0; i < 30; ++i) {
      var day = theDate.getDay();
      if(day != 0 && day != 6) {
        data.dates.push({date:theDate.toDateString(), dateString:theDate.toDateString().substr(0, 10), users: [], usersDates: [], today: theDate.getTime()==today.getTime()});
      }
      theDate.setDate(theDate.getDate() + 1);
    }
  }
  
  function addUsersToDates(users) {
    for(var idx in data.dates) {
      data.dates[idx].users = JSON.parse(JSON.stringify(users));
    }
  }
  
  function getUsers(dataArray, cb) {
    var strQuery = "SELECT * FROM users ORDER BY username ASC";
    mysql.query( strQuery, dataArray, function(err, res) {
      if(err)	{
        throw err;
      } else {
        data.users = JSON.parse(JSON.stringify(res));
        addUsersToDates(res);
        getUsersDate(dataArray, cb);
      }
    });
  }
  
  function getUsersDate(dataArray, cb) {
    var strQuery = "SELECT *, IF((free > 0), IF((free > 1), 'free', 'half'), '') AS free FROM roster.users_dates WHERE dt >= DATE_SUB(NOW(), INTERVAL 1 day) AND dt <= DATE_ADD(NOW(), INTERVAL 30 day) ORDER BY dt ASC";
    mysql.query( strQuery, dataArray, function(err, res) {
      if(err)	{
        throw err;
      } else {
        for(var idx in data.dates) {
          for(var idx2 in data.dates[idx].users) {
            for(var idx3 in res) {
              if(data.dates[idx].users[idx2].id == res[idx3].user_id &&
                  data.dates[idx].date == (new Date(res[idx3].dt)).toDateString()) {
                res[idx3].dt = (new Date(res[idx3].dt)).toDateString();
                data.dates[idx].users[idx2].settings = JSON.parse(JSON.stringify(res[idx3]));
              }
            }
          }
        }
        cb();
      }
    });
  }
  
  function renderHtml(res, slug, data) {
    var head = fs.readFileSync('templates/partials/head/' + slug + '/head.html', "utf8"); // bring in the HEAD
    var body = fs.readFileSync('templates/partials/body/' + slug + '/body.html', "utf8"); // bring in the BODY
    var footer = fs.readFileSync('templates/partials/footer/' + slug + '/footer.html', "utf8"); // bring in the FOOTER
    var page = fs.readFileSync('templates/main.html', "utf8"); // bring in the HTML file
    var html = mustache.to_html(page, data, {head: head, body: body, footer: footer}); // replace all of the data
    res.send(html);
  }

}
