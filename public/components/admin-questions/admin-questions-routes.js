'use strict';

(function() {

  angular.module('svs.adminQuestions')
  .config(routeConfig);

  // @ngInject
  function routeConfig($stateProvider) {
    $stateProvider.state('adminQuestions', {
      url: '/admin/questions',
      views: {
        main: {
          templateUrl: 'admin-questions/admin-questions.html',
          controller: 'AdminQuestionsController',
          controllerAs: 'questions'
        }
      }
    });
  }
})();
