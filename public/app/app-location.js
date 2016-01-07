'use strict';
(function() {

  angular.module('svs')
    .config(locationConfig);

  // @ngInject
  function locationConfig($locationProvider) {
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');
  }
})();

