'use strict';

(function() {

  angular.module('svs.adminQuestions')
  .controller('EditQuestionController', EditQuestionController);

  function EditQuestionController($scope, Question, Choice, $q, question) {
    var vm = this;
    vm.close = $scope.closeThisDialog;
    vm.saveQuestion = saveQuestion;
    vm.question = question;
    vm.errors = [];

    vm.choices = question.choices;
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
      .$update()
      .then(function() {
        return $q.all(vm.choices.map(function(choice) {
          var choiceResource = new Choice(choice);
          if (choice.id) {
            return choiceResource.$update();
          }
          choiceResource.questionId = vm.question.id;
          return choiceResource.$save();
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
