/**
 * Created by Urriel.
 */

var http = require('request');
var Q    = require('q');


/**
 * Send a GET request.
 * @param uri {string}: request uri
 * @param headers {null|object}: optional headers
 * @returns {promise}
 */
function get (uri, headers) {
  var deferred = Q.defer();

  var options = {
    method : "GET",
    uri    : uri
  };

  if (typeof headers === 'object') {
    for (var element in headers) {
      if (headers.hasOwnProperty(element))
        options.headers[element] = headers[element];
    }
  }

  function callback (error, ignored, body) {
    if (error)
      deferred.reject(body);
    else
      deferred.resolve(body);
  }

  http(options, callback); // send the request

  return deferred.promise;
}

/**
 * Send a POST request.
 * @param uri {string}: request uri.
 * @param params {*}: request parameters
 * @param headers {null|object}: optional headers
 * @returns {promise}
 */
function post (uri, params, headers) {
  var options = {
    uri    : uri,
    method : "POST",
    body   : params
  };

  if (typeof headers === 'object') {
    for (var key in headers) {
      if (headers.hasOwnProperty(key))
        options.headers[key] = headers[key];
    }
  }


  http(options, callback);
}

module.exports = {
  get  : get,
  post : post
};