/**
 * Created by Urriel.
 */
var Oauth2 = require('simple-oauth2');

/**
 * Oauth token request
 * @returns {*}: Return a promise
 */
function getToken () {
  var oauth = Oauth2(global.credentials);

  return oauth.client
    .getToken({})
    .then(function saveToken (result) {
      return oauth.accessToken.create(result);
    });
}

module.exports = {
  getToken : getToken
};