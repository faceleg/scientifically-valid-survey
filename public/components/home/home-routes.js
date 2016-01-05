(function() {
  'use strict';

  angular.module('svs.home')
  .config(routeConfig);

  // @ngInject
  function routeConfig($stateProvider) {
    $stateProvider.state('home', {
      url: '/',
      views: {
        main: {
          templateUrl: 'home/home.html',
          controller: 'HomeController',
          controllerAs: 'home'
        }
      }
    });
  }
})();
