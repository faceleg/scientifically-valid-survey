'use strict';

(function() {

  angular.module('svs', [
    'ngResource',
    'ui.router',
    'ngTable',
    'ngDialog',

    'svs.templates',

    'svs.home',
    'svs.adminQuestions'
  ]);
})();
