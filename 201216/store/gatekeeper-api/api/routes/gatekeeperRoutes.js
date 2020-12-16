module.exports = function(app) {
    var gatekeepers = require('../controllers/gatekeeperController');
  
    app.route('/gates')
      .get(gatekeepers.get_all);
      
    app.route('/gates/:gate_id/unlock')
      .post(gatekeepers.unlock);
  };