'use strict';

(function() {

  angular.module('svs.answerResource')
  .factory('Answer', AnswerFactory);

  function AnswerFactory($resource) {
    return $resource('/api/answers/:id', {
      id: '@id'
    }, {
      query: {
        isArray: true
      },
      create: {
        url: '/public-api/answers',
        method: 'POST'
      }
    });
  };
})();
