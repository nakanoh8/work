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
              // �J��TODO ���O�o��
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
  //TODO �{���̓��O�C������SG����Ȃ������ǂ����܂��͂����
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
    // ���ݎ��Ԃ̎擾
    var end = new Date();
    // �o�ߎ���
    var executionTime = end.getTime() - start.getTime();
    // 10�b���g���C���Ă����߂ȂƂ��͏I��
    if( executionTime >= 1000 * 10 ) return callback();

    if( mode == "login" ) url = urls[0];
    else if( mode == "status" ) url = urls[1];
    else if( mode == "control" ) url = urls[2];
    else return callback();

    console.log("call url:", url.url);

    // ���O�C�����[�h�ȊO�Ȃ�F�؃R�[�h�ݒ�
    if( mode != "login" ) url.headers['X-Authorization'] = authCode;
    console.log(url)
    // HTTP ���N�G�X�g�̔��s
    request(url, function(error, response, body) {
      console.log( "statusCode:", response.statusCode);
      console.log( "body:", body);
      if (!error && response.statusCode >= 200 && response.statusCode <= 210 ) {
         // ���O�C���E���[�h�̏ꍇ
         if( mode == "login" ){
             nextMode = "status";
             // �F�؃L�[��ۑ�
             authCode = body.authorization;
             if (cmdForce) nextMode = "control";
         // �X�e�[�^�X�m�F���[�h�̏ꍇ
         } if( mode == "status" ){
             // �e��X�e�[�^�X���擾
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
             // ���b�N���������Ƀ��b�N�ς݂Ȃ̂ŏI��
             if( cmd == 'lock' && unlockedStat == false && !cmdForce ) return callback();
             // �A�����b�N���������ɃA�����b�N�ς݂Ȃ̂ŏI��
             if( cmd == 'unlock' && unlockedStat == true && !cmdForce ) return callback();
             // �R���g���[��API���s�� 5��X�e�[�^�X�m�F���J��Ԃ�
             if( loopCounter >= 1 && loopCounter <= 5 ){
                 nextMode = "status";
                 nextTimer = 10000; // 10�b�Ԋu
                 loopCounter++;
             } else {
                 // �����������5��X�e�[�^�X�m�F��̓R���g���[��API���s
                 nextMode = "control";
                 loopCounter = 1;
             }
         // �R���g���[���E���[�h�̏ꍇ
         } if( mode == "control" ){
             // �R�}���h���M��̓X�e�[�^�X�m�F�i���[�v�J�E���^���������j
             nextMode = "status";
             loopCounter = 1;
             // ��x�R���g���[���R�}���h�𑗂����狭���t���O�𖳌���
             cmdForce = false;
         }
      }

      // �w�胂�[�h�ɐ���
      console.log("execute next mode after 10 sec...");
      setTimeout(function() {
         execRequest(nextMode, cmd)
      }, nextTimer );
    });
  }
  // login ���珈�����J�n
  execRequest("login", cmd);

}