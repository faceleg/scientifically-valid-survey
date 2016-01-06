'use strict';

(function() {

  angular.module('svs.adminQuestions')
  .controller('EditQuestionController', EditQuestionController);

  function EditQuestionController($scope, Question, Choice, $q, question) {
    var vm = this;
    vm.cancel = $scope.closeThisDialog;
    vm.saveQuestion = saveQuestion;
    vm.question = question;
    vm.errors = [];

    vm.choices = [];
    vm.removeChoice = removeChoice;
    vm.addChoice = addChoice;
    vm.addChoice();

    return;

    function addChoice() {
      vm.choices.push(new Choice());
    }

    function removeChoice($index) {
      vm.choices.splice($index, 1)
    }

    function saveQuestion() {
      vm.errors = [];
      vm.question
      .$save()
      .then(function() {
        return $q.all(vm.choices.map(function(choice) {
          choice.questionId = question.id;
          return choice.$save();
        }))
      })
      .then(function() {
        vm.closeThisDialog(true);
      })
      .catch(function(response) {
        vm.errors.push(response.data);
      });
    }
  }
})();
