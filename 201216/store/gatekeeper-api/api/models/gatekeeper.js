const path = require('path');
const fs = require('fs');
const request = require('request');

module.exports = {
    getAll: function () {
        return getGateConfs ();
    },
    unlock: function (gate_id,user_id) {
        var gateConf = getGateConfs()[gate_id];

        console.log(gateConf);
        console.log('unlocked...');

        result = execRequests(gateConf,"unlock", function() {
            console.log("---------End--------");
        });

        return { gate_operation_id : "0000" };
    },
    lock: function (gatekeeper_id) {
        var gateConf = getGateConfs()[gate_id];

        // TODO
        console.log(gateConf);
        console.log('locked...');

        start =  new Date();
        result = execRequests(gateConf,"lock", function() {
            console.log("---------End--------");
              // 開錠TODO ログ出力
        });

        return { gate_operation_id : "0000" };
    }
}

function getGateConfs () {
    var confDir = './conf/gates';
    var files = fs.readdirSync(confDir);

    var gateConfs = {};
    files.forEach(function(file){ 
        console.log(file);
        var id = file.split('.').shift();
        var jsonObject = JSON.parse(fs.readFileSync(path.join(confDir, file), 'utf8'));
        gateConfs[id] = jsonObject;
    });
    return gateConfs;
}

function execRequests(gateConf,cmd,callback) {
  var url;
  var authCode = 0;
  var nextTimer = 0;
  var cmdForce = false;
  var loopCounter = 0;
  var controlPostData = {"type": cmd };
  var start =  new Date();
  //TODO 本来はログイン情報はSGじゃない方が良いがまずはこれで
  var loginPostData = {
     email : gateConf.loginId,
     password : gateConf.pass
  };

    var urls = [
    {
      url: 'https://api.candyhouse.co/v1/accounts/login',
      method: 'POST',
      headers: { 'Content-Type' : 'application/json' },
      json: loginPostData
    },
    {
      url: 'https://api.candyhouse.co/v1/sesames',
      headers: { 'X-Authorization' :  authCode },
      method: 'GET',
    },
    { 
      url:`https://api.candyhouse.co/v1/sesames/${gateConf.deviceId}/control`,
      method: 'POST',
      headers: { 'Content-Type' : 'application/json' },
      json: controlPostData
    },
    {url: 'end',method: 'GET',
    }]

  function execRequest(mode, cmd) {
    // 現在時間の取得
    var end = new Date();
    // 経過時間
    var executionTime = end.getTime() - start.getTime();
    // 10秒リトライしてもだめなときは終了
    if( executionTime >= 1000 * 10 ) return callback();

    if( mode == "login" ) url = urls[0];
    else if( mode == "status" ) url = urls[1];
    else if( mode == "control" ) url = urls[2];
    else return callback();

    console.log("call url:", url.url);

    // ログインモード以外なら認証コード設定
    if( mode != "login" ) url.headers['X-Authorization'] = authCode;
    console.log(url)
    // HTTP リクエストの発行
    request(url, function(error, response, body) {
      console.log( "statusCode:", response.statusCode);
      console.log( "body:", body);
      if (!error && response.statusCode >= 200 && response.statusCode <= 210 ) {
         // ログイン・モードの場合
         if( mode == "login" ){
             nextMode = "status";
             // 認証キーを保存
             authCode = body.authorization;
             if (cmdForce) nextMode = "control";
         // ステータス確認モードの場合
         } if( mode == "status" ){
             // 各種ステータスを取得
             var data = JSON.parse(body);
             var unlockedStat = true;
             var batteryStat = 100;
             if( data.sesames[0] ){
                 console.log('device_id: ' + data.sesames[0].device_id);
                 console.log('nickname: ' + data.sesames[0].nickname);callback
                 batteryStat = data.sesames[0].battery;
                 console.log('batteryStat: ' + batteryStat);
                 unlockedStat = data.sesames[0].is_unlocked;
                 console.log('is_unlocked: ' + unlockedStat);
             }
             if( unlockedStat ) console.log('sesami unlocked');
                else  console.log('sesami lock');
             // ロック処理＆既にロック済みなので終了
             if( cmd == 'lock' && unlockedStat == false && !cmdForce ) return callback();
             // アンロック処理＆既にアンロック済みなので終了
             if( cmd == 'unlock' && unlockedStat == true && !cmdForce ) return callback();
             // コントロールAPI発行後 5回ステータス確認を繰り返す
             if( loopCounter >= 1 && loopCounter <= 5 ){
                 nextMode = "status";
                 nextTimer = 10000; // 10秒間隔
                 loopCounter++;
             } else {
                 // 初回もしくは5回ステータス確認後はコントロールAPI発行
                 nextMode = "control";
                 loopCounter = 1;
             }
         // コントロール・モードの場合
         } if( mode == "control" ){
             // コマンド発信後はステータス確認（ループカウンタも初期化）
             nextMode = "status";
             loopCounter = 1;
             // 一度コントロールコマンドを送ったら強制フラグを無効化
             cmdForce = false;
         }
      }

      // 指定モードに推移
      console.log("execute next mode after 10 sec...");
      setTimeout(function() {
         execRequest(nextMode, cmd)
      }, nextTimer );
    });
  }
  // login から処理を開始
  execRequest("login", cmd);

}