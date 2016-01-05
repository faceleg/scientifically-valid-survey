(function() {
  'use scrict';

  angular.module('svs.answerResource')
  .factory('Answer', AnswerFactory);

  function AnswerFactory($resource) {
    return $resource('/api/answers/:id', {
      id: '@id'
    });
  };
})();
