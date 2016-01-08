'use strict';

(function() {

  angular.module('svs.adminQuestions')
  .controller('AddQuestionController', AddQuestionController);

  function AddQuestionController($scope, Question, Choice, $q) {
    var vm = this;
    vm.close = $scope.closeThisDialog;
    vm.saveQuestion = saveQuestion;
    vm.question = new Question();
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
      .then(function(question) {
        return $q.all(vm.choices.filter(function(choice) {
          return choice.text;
        })
        .map(function(choice) {
          choice.questionId = question.id;
          return choice.$save();
        }))
      })
      .then(function() {
        vm.close(true);
      })
      .catch(function(response) {
        vm.errors.push(response.data);
      });
    }
  }
})();
