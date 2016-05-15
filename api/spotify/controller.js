/**
 * Created by Urriel.
 */
var http  = require('request');
var oauth = require('../utils/oauth');
var Q     = require('q');

function _removeDuplicates (data) {
  var result = [];
  var regex  = /[^a-zA-Z0-9]*/g;
  var add;
  var i, j;
  var cmp, tmp;

  for (i = 0; i < data.length; i++) {
    add = true;
    cmp = data[i];
    for (j = 0; j < result.length; j++) {
      tmp = result[j];
      if (tmp.name.replace(regex, '').toLowerCase() === cmp.name.replace(regex, '').toLowerCase())
        add = false;
    }

    if (add)
      result.push(cmp);

  }

  return result;
}

/**
 * Clean the response and return only an array.
 * @param response {object}: response's object
 * @returns {Array}: list of albums
 * @private
 */
function _responseCleaner (response) {
  var result = [];

  for (var key in response.items) {
    if (response.items.hasOwnProperty(key)) {
      result.push({
                    type  : response.items[key].type,
                    image : response.items[key].images[0],
                    name  : response.items[key].name
                  });
    }
  }

  return result;
}

/**
 *
 * @param token: Oauth2 token
 * @param limit: list size limit
 * @param offset: list offset start.
 * @returns {promise}
 * @private
 */
function _fetch (token, limit, offset) {
  var deferred = Q.defer();
  var settings = {
    method  : 'GET',
    uri     : 'https://api.spotify.com/v1/artists/6mdiAmATAx73kdxrNrnlao/albums?album_type=album&limit=' + limit + '&offset=' + offset,
    json    : true,
    headers : {
      'Authorization' : token.token.token_type + ' ' + token.token.access_token
    }
  };

  http(settings, _callback);

  function _callback (error, ignored, body) {
    if (error || body === undefined || body.error !== undefined) // error handling
      return deferred.reject(body.error);
    deferred.resolve(_responseCleaner(body));
  }

  return deferred.promise;
}

function index (ignored, res) {
  var data   = [];
  var limit  = 20;
  var offset = 0;

  if (global.TOKEN === undefined)
    return oauth.getToken().then(_request).catch(_error);

  if (global.TOKEN.expired())
    return global.TOKEN.refresh().then(_request).catch(_error);

  _request(global.TOKEN);

  function _request (token) {
    global.TOKEN = token; // set Token as global
    _fetch(token, limit, offset).then(_success).catch(_error);
  }

  function _success (response) {
    if (response.length !== 0) { // concat each response
      data = data.concat(response);
      offset += limit;
      _request(global.TOKEN);
    } else { // return the complete list
      res.status(200).send(_removeDuplicates(data));
    }
  }

  function _error (error) {
    res.status(error.status).send(error);
  }
}

module.exports = {
  index : index
};