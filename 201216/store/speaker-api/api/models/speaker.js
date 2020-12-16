const path = require('path');
const fs = require('fs');

module.exports = {
    getAll: function () {
        return getSpeakerConfs ();
    },
    speake: function (speaker_id, message) {
        var speakerConf = getSpeakerConfs()[speaker_id];
        console.log(speaker_id);

        var googlehome = require('google-home-notifier');
        var language = 'ja'; // �����ɓ��{���\�� ja ��ݒ�

        // �l�b�g���[�N������Google Home�������Ă����
        googlehome.device(speakerConf.id, language); 
        // ���� Google Home ��IP�A�h���X���w�肷��Ȃ�A�ȉ��̃X�N���v�g�ɒu��������
        //googlehome.ip(speakerConf.ipaddr, language);

        googlehome.notify(message, function(res) {
          console.log(res);
        });
        console.log(speakerConf);
        console.log(message);


        return { speake_id : "0000" };
    }
}

function getSpeakerConfs () {
    var confDir = './conf/speakers';
    var files = fs.readdirSync(confDir);

    var speakerConfs = {};
    files.forEach(function(file){ 
        console.log(file);
        var id = file.split('.').shift();
        var jsonObject = JSON.parse(fs.readFileSync(path.join(confDir, file), 'utf8'));
        speakerConfs[id] = jsonObject;
    });
    return speakerConfs;
}