
const speaker = require('../models/speaker');

exports.get_all = function(req, res) {
    res.json(speaker.getAll());
};

exports.speake = function(req, res) {
    var speaker_id = req.params.speaker_id;
    var message = req.body.message;
    console.log(req.body);
    var result = speaker.speake(speaker_id, message);
    res.json(result);
};