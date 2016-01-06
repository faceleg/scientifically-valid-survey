'use strict';

(function() {
  angular.module('svs.choiceResource')
  .factory('Choice', ChoiceFactory);

  function ChoiceFactory($resource) {
    return $resource('/api/choices/:id', {
      id: '@id'
    });
  };
})();
