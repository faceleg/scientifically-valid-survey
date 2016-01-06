'use strict';

(function() {

  angular.module('svs', [
    'ngResource',
    'ui.router',
    'ngTable',
    'ngDialog',
    'ngTouch',

    'svs.templates',

    'svs.home',
    'svs.adminQuestions'
  ]);
})();
