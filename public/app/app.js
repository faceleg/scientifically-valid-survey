'use strict';

(function() {

  angular.module('svs', [
    'ngResource',
    'ui.router',
    'ngTable',
    'ngDialog',
    'angular-storage',
    'ngTouch',

    'svs.templates',
    'svs.loginDialog',
    'svs.home',
    'svs.adminQuestions'
  ]);
})();
