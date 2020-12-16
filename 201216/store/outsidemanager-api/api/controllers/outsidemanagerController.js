
const outsidemanager = require('../models/outsidemanager');

exports.enteruser = function(req, res) {
    var authentication_status = req.body.authentication_status;
    var user_id = req.body.user_id;
    
    console.log(authentication_status);
    console.log(user_id);
    var result = outsidemanager.enteruser(authentication_status, user_id);
    res.json(result);
};