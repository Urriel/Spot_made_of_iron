/**
 * Created by Urriel.
 */
(function () {
  angular.module('app')
    .factory('ApiService', ApiService);

  ApiService.$inject = ['$http', '$q']; // Import to prevent uglyfi errors.
  function ApiService ($http, $q) {
    var publicMethods = {};

    publicMethods.retrieveAlbums = retrieveAlbums;
    /**
     * Request Iron Maiden's albums
     * ************
     * The HttpPromise is not supposed to be used more than once.
     * $q let us use chained promises through another implementation.
     * ************
     * @returns {Promise}: promise
     */
    function retrieveAlbums () {
      var deferred = $q.defer();

      $http({
              method  : 'GET',
              url     : 'http://localhost:3000/api/spotify',
              headers : {
                'Content-Type' : 'application/json'
              }
            }).then(_success, _error);

      /**
       * Success CallBack
       * @param data: response data
       * @private
       */
      function _success (data) {
        deferred.resolve(data.data); // $q async success callback.
      }

      /**
       * Error CallBack
       * @param data: response data
       * @private
       */
      function _error (data) {
        deferred.reject(data); // $q async error callback.
      }

      return deferred.promise;
    }

    return publicMethods;
  }
})();