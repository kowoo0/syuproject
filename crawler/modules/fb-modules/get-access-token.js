const FB = require('fb');

// const fb_config = require('../../config/fb-config.json');

const getAccessToken = () => {
  return new Promise((resolve, reject) => {
    // 페이스북 토큰 생성 => facebook.api(url, args, callback function)
    FB.api('oauth/access_token', {
      client_id: fb_config.clientId,
      client_secret: fb_config.clientSecret,
      grant_type: fb_config.grantType
    },
    // callback
    (res) => {
      if(!res || res.error) {
        reject(!res ? 'error occurred' : res.error);
      }

      resolve(res.access_token); // 응답 액세스 토큰

      console.log("getAccessToken function exit..")
    });
  });
};


module.exports = getAccessToken;
