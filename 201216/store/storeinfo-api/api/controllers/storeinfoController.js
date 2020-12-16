const logger = require('../common/logger');
const storeinfo = require('../models/storeinfo');

/*
例外時共通応答設定処理
 */
function setErrRes(res,err) {
    logger.system.error(err.stack);
    res.status(500);
    res.json({});
    res.end()
}

exports.createUser = async function(req, res) {
    try {
        var user_id = req.body.user_id;
        var regData = req.body.data;
        var result = await storeinfo.regUser(user_id, regData);
        res.status(result.resultStatus);
        res.json(result.data);
    } catch(e) {
        setErrRes(res,e)
    }
};

exports.createAuthVector = async function(req, res) {
    try {
        var regData = req.body.data;
        var result = await storeinfo.regAuthVector(regData);
        res.status(result.resultStatus);
        res.end()
    } catch(e) {
        setErrRes(res,e)
    }
};

exports.getUserById = async function(req, res) {
    try {
        var user_id = req.params.user_id;
        var result = await storeinfo.readUserId(user_id);
        res.status(result.resultStatus);
        res.json(result.data);
    } catch(e) {
        setErrRes(res,e)
    }
};

exports.getAllUser = async function(req, res) {
    try {
        var result = await storeinfo.readAllUser();
        res.status(result.resultStatus);
        res.json(result.data);
    } catch(e) {
        setErrRes(res,e)
    }
};

exports.getUserByConditions = async function(req, res){
    try {
        var condition = {};
        condition[req.params.wherekey] = req.params.wherevalue;
        var result = await storeinfo.readUserByConditions(condition);
        res.status(result.resultStatus);
        res.json(result.data);
    } catch(e) {
        setErrRes(res,e)
    }
};

exports.getAllAuthVector = async function(req, res) {
    var result = await storeinfo.readAuthVectors();
    res.status(result.resultStatus);
    res.json(result.data);
};