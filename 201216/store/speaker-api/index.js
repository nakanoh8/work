const googlehome = require('google-home-notifier');
const lang = 'ja';

googlehome.device('Google Home', lang);
googlehome.notify('‚±‚ñ‚É‚¿‚Í',function(res){
    console.log(res);
});