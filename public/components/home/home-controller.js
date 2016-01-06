'use strict';

(function() {

  angular.module('svs.home')
  .controller('HomeController', HomeController);

  function HomeController(Question, Answer) {
    var vm = this;
    vm.success = null;
    vm.error = null;
    vm.question = null;

    vm.answer = new Answer();
    vm.saveAnswer = saveAnswer;

    randomQuestion();

    return;

    function saveAnswer() {
      vm.error = null;
      vm.success = null;

      vm.answer.questionId = vm.question.id;

      vm.answer.$save()
      .then(function() {
        randomQuestion();
        vm.success = 'Your excellent answer was saved, do more science!';
        vm.answer = new Answer();
      })
      .catch(function(response) {
        vm.error = response.data;
      });
    }

    function randomQuestion() {
      vm.error = null;
      return Question.random()
      .$promise
      .then(function(question) {
        vm.question = question;
      })
      .catch(function(response) {
        vm.question = null;
        vm.error = response.data;
      })
    }
  }
})();
