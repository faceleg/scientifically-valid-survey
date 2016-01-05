(function() {
  'use strict';

  angular.module('svs.adminQuestions')
  .config(routeConfig);

  // @ngInject
  function routeConfig($stateProvider) {
    $stateProvider.state('admin-questions', {
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
