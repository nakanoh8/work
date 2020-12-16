module.exports = function(app) {
    var speakers = require('../controllers/speakerController');
  
    app.route('/speakers')
      .get(speakers.get_all);
  
  
    app.route('/speakers/:speaker_id/speake')
      .post(speakers.speake);
  };