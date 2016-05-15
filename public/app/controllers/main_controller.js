/**
 * Created by Urriel.
 */

(function () {
  angular.module('app')
    .controller('MainController', MainController);

  MainController.$inject = ['ApiService', 'toastr'];
  function MainController (api, $toastr) {
    var self    = this;
    self.list   = [];
    self.search = '';

    _retrieve(); // start retrieving

    /**
     * Use the ApiService to retrieve the albums.
     * @private
     */
    function _retrieve () {
      api.retrieveAlbums().then(_success).catch(_error);
    }

    /**
     * Success CallBack
     * @param data: response data
     * @private
     */
    function _success (data) {
      self.list = data;
    }

    /**
     * Error CallBack.
     * @param data: response data
     * @private
     */
    function _error (data) {
      if (data.data.context)
        $toastr.warning(data.data.context.error_description);
      if (data.data.error)
        $toastr.warning(data.data.error.message);
      if (data.data)
        $toastr.warning(data.data);
    }
  }
})();