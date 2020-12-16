
const gatekeeper = require('../models/gatekeeper');

exports.get_all = function(req, res) {
    res.json(gatekeeper.getAll());
};

exports.unlock = function(req, res) {
    var gatekeeper_id = req.params.gate_id;
    var user_id = req.body.user_id;
    console.log(req.params.gate_id);
    var result = gatekeeper.unlock(gatekeeper_id,user_id);
    res.json(result);
};

exports.lock = function(req, res) {
    var gatekeeper_id = req.params.gate_id;
    
    var result = gatekeeper.lock(gatekeeper_id);
    res.json(result);
};