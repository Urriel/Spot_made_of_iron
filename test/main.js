/**
 * Created by Urriel.
 */
var fs         = require('fs');
var expect     = require('chai').expect;
var controller = require('../api/spotify/controller');
var oauth      = require('../api/utils/oauth');
var Q          = require('q');


function responseAssert (statusCode, response, callBack) {
  var publicMethods = {};


  publicMethods.status = status;
  function status (code) {
    expect(code).to.be.a('number').equal(statusCode);
    return publicMethods;
  }

  publicMethods.send = send;
  function send (data) {
    for (var key in response) {
      if (response.hasOwnProperty(key))
        expect(data[key]).equal(response[key]);
    }

    callBack();
  }

  return publicMethods;
}

global.credentials = {
  site              : 'https://accounts.spotify.com/',
  authorizationPath : 'https://accounts.spotify.com/authorize',
  tokenPath         : 'https://accounts.spotify.com/api/token'
};

describe('Credentials', function () {
  it('credentials.json must be present', function (done) {

    fs.readFile('credentials.json', 'utf8', function (err, data) {
      data = JSON.parse(data);

      for (var key in data) {
        if (data.hasOwnProperty(key))
          global.credentials[key] = data[key];
      }

      try {
        expect(global.credentials.clientID).to.be.a('string');
        expect(global.credentials.clientSecret).to.be.a('string');
      } catch (e) {
        done(e);
      }
      done();
    });

  });

  it('Credentials should be authorized', function (done) {

    oauth.getToken().then(function (token) {
      try {
        expect(token.token.access_token).to.be.a('string');
        expect(token.token.token_type).to.be.a('string').equal('Bearer');
      } catch (e) {
        done(e);
      }
      done();
    }).catch(function (e) {
      done(e);
    });
  });
});

describe('Controller', function () {
  this.timeout(30000);

  it('Should retrieve the Iron Maiden\'s albums', function (done) {
    controller.index(null, responseAssert(200, {}, function () {
      done();
    }));
  });
});