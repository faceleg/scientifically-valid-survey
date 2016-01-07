'use strict';
(function() {

  angular.module('svs')
    .config(a0AngularStorageConfig);

  // @ngInject
  function a0AngularStorageConfig(storeProvider) {
    storeProvider.setStore('sessionStorage');
  }
})();

