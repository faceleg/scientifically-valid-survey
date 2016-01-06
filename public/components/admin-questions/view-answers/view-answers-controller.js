'use strict';

(function() {

  angular.module('svs.adminQuestions')
  .controller('ViewAnswersController', ViewAnswersController);

  function ViewAnswersController($scope, question, answers) {
    var vm = this;
    vm.close = $scope.closeThisDialog;
    vm.answers = answers;
    vm.question = question;
  }
})();
