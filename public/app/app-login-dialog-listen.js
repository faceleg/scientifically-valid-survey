'use strict';
(function() {
  angular.module('svs')
    .run(loginDialogListen);

  // @ngDialog
  function loginDialogListen(loginDialogService) {
    loginDialogService.listen();
  }
})();

