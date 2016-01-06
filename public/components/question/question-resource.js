'use strict';

(function() {
  angular.module('svs.questionResource')
  .factory('Question', QuestionFactory);

  function QuestionFactory($resource) {
    var URL = '/api/questions/';
    return $resource(URL + ':id', {
      id: '@id'
    },
    {
      query: {
        url: URL,
        isArray: true
      },
      random: {
        url: URL + 'random'
      },
      update: {
        method: 'PUT'
      }
    });
  };
})();
