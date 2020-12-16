module.exports = function(app) {
    var outsidemanager = require('../controllers/outsidemanagerController');
  
    app.route('/store/outside/enterUser')
      .post(outsidemanager.enteruser);
  };