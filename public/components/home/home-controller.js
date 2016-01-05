'use strict';

(function() {

  angular.module('svs.home')
  .controller('HomeController', HomeController);

  function HomeController(Question, Answer) {
    var vm = this;
    vm.success = null;
    vm.error = null;

    vm.question = Question.random();

    vm.answer = new Answer();
    vm.saveAnswer = saveAnswer;

    return;

    function saveAnswer() {
      vm.error = null;
      vm.success = null;

      vm.answer.questionId = vm.question.id;

      vm.answer.$save()
      .then(function() {
        vm.question = Question.random();
        vm.success = 'Your excellent answer was saved, do more science!';
        vm.answer = new Answer();
      })
      .catch(function(response) {
        vm.error = response.data;
      });
    }
  }
})();
