'use strict';

(function() {
  angular.module('svs.questionResource')
  .factory('Question', QuestionFactory);

  function QuestionFactory($resource) {
    return $resource('/api/questions/:id', {
      id: '@id'
    },
    {
      query: {
        isArray: false
      },
      random: {
        url: '/public-api/questions/random'
      },
      update: {
        method: 'PUT'
      }
    });
  };
})();
