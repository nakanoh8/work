const path = require('path');
const fs = require('fs');
const e = require('express');
const request = require('request');
const { json } = require('express');

module.exports = {

    enteruser: function (authentication_status, user_id) {
        var urls = {
            url: `http://localhost:8011/storeInfo/users/${user_id}`,
            method: 'GET',
            headers: { 'Content-Type' : 'application/json' },
            json: true
        }
        
        var sperker_id = "googlehome0001";
        var gate_id = "sesami0001";
        // 入店可
        if (authentication_status === "success") {
            // 顧客情報取得
            request(urls, function(error, response, body) {
                if (!error) {
                    // 404(登録なしなら登録なしエラー)
                    if (response.statusCode == 404) {
                        speake(sperker_id, "利用者情報がありません。運用者に確認してください。");
                        return;
                    }
                    // 登録があればspeaker連携および開錠要求
                    var user_name = body[user_id].user_name;
                    speake(sperker_id, "いらっしゃいませ" + user_name + "様。");
                    unlock(gate_id);
                } else {
                    console.log("Error!!");
                }
            })
        } else {
            // 入店不可
            speake(sperker_id, "認証情報が未登録です。認証情報を登録してください。");
        }

        // TODO : 結果返却制御。
        return { store_operation_id : "0000" };
    }
}

function speake (sperker_id, message) {
  var url;
  var authCode = 0;
  var nextTimer = 0;
  var cmdForce = false;
  var loopCounter = 0;
  var controlPostData = {
      "sperker_id": sperker_id,
      message: message
  };
  var start =  new Date();


  var urls = {
      url: `http://localhost:8081/speakers/${sperker_id}/speake`,
      method: 'POST',
      headers: { 'Content-Type' : 'application/json' },
      json: controlPostData
  }

    request(urls, function(error, response, body) {
    })
    return "";
}

function unlock (gate_id) {
  var url;
  var authCode = 0;
  var nextTimer = 0;
  var cmdForce = false;
  var loopCounter = 0;
  var controlPostData = {
      "gate_id": gate_id,
  };
  var start =  new Date();

  var urls = {
      url: `http://localhost:8082/gates/${gate_id}/unlock`,
      method: 'POST',
      headers: { 'Content-Type' : 'application/json' },
      json: controlPostData
  }

    request(urls, function(error, response, body) {
    })
    return "";
}

