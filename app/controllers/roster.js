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
  
  function resetData() {
    data = {
      title: 'Roster',
      html_classes: 'roster',
      dates: []
    };
  }
  
  app.get('/', getIndex);
  app.get('/roster', getIndex);
  function getIndex(req, res){ // INDEX
    resetData();
    var startDate = new Date();
    while (startDate.getDay() != 1) {
      startDate.setDate(startDate.getDate() - 1); // Set to yesterday
    }
    initDates(startDate);
    
    getUsers(function() {
      renderHtml(res, data);
    })
  };
  
  app.get('/roster/:slug', function(req, res){ // get the url and slug info
    resetData();
    var slug =[req.params.slug][0]; // grab the page slug
    var startDate = new Date(slug);
    initDates(startDate);
    getUsers(function() {
      renderHtml(res, data);
    });    
  });
  
  function initDates(startDate) {
    var today = new Date();
    for(var i = 0; i < 30; ++i) {
      var day = startDate.getDay();
      if(day != 0 && day != 6) { // Not weekends
        data.dates.push({
          date:startDate.toDateString(), 
          dateString:startDate.toDateString().substr(0, 10), 
          users: [], 
          usersDates: [], 
          today: (startDate.toDateString()==today.toDateString())?'today':''});
      }
      startDate.setDate(startDate.getDate() + 1);
    }
  }
  
  function addUsersToDates(users) {
    for(var idx in data.dates) {
      data.dates[idx].users = JSON.parse(JSON.stringify(users));
    }
  }
  
  function getUsers(cb) {
    var strQuery = "SELECT * FROM users ORDER BY username ASC";
    mysql.query( strQuery, function(err, res) {
      if(err)	{
        throw err;
      } else {
        data.users = JSON.parse(JSON.stringify(res));
        addUsersToDates(res);
        getUsersDate(cb);
      }
    });
  }
  
  function getUsersDate(cb) {
    var strQuery = "SELECT *, IF((free > 0), IF((free > 1), 'free', 'half'), '') AS free, IF(out_of_office>0, 'out-of-office', '') AS out_of_office, IF(support_duty>0, 'support-duty', '') AS support_duty FROM users_dates WHERE dt>=? AND dt<=? ORDER BY dt ASC";
    var startDate = new Date(data.dates[0].date);
    var endDate = new Date(data.dates[data.dates.length-1].date);
    startDate.setDate(startDate.getDate() - 7);
    mysql.query( strQuery, [startDate, endDate], function(err, res) {
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
  
  function renderHtml(res, data) {
    var head = fs.readFileSync('templates/partials/head/roster/head.html', "utf8"); // bring in the HEAD
    var body = fs.readFileSync('templates/partials/body/roster/body.html', "utf8"); // bring in the BODY
    var footer = fs.readFileSync('templates/partials/footer/roster/footer.html', "utf8"); // bring in the FOOTER
    var page = fs.readFileSync('templates/main.html', "utf8"); // bring in the HTML file
    var html = mustache.to_html(page, data, {head: head, body: body, footer: footer}); // replace all of the data
    res.send(html);
  }

}
