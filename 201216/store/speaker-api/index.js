const googlehome = require('google-home-notifier');
const lang = 'ja';

googlehome.device('Google Home', lang);
googlehome.notify('����ɂ���',function(res){
    console.log(res);
});