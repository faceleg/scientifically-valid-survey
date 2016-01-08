'use strict';

(function() {

  angular.module('svs', [
    'ngResource',
    'ui.router',
    'ngTable',
    'ngDialog',
    'angular-storage',
    'ngTouch',
    'angular-loading-bar',

    'svs.templates',
    'svs.loginDialog',
    'svs.home',
    'svs.adminQuestions'
  ]);
})();
