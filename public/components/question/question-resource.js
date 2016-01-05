'use scrict';
(function() {
  angular.module('svs.questionResource')
  .factory('Question', QuestionFactory);

  function QuestionFactory($resource) {
    var URL = '/api/questions/';
    return $resource(URL + ':id', {
      id: '@id'
    },
    {
      random: {
        url: URL + 'random',
        id: 'random',
        params: 'random'
      }
    });
  };
})();
