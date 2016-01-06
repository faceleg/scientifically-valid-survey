'use strict';

(function() {

  angular.module('svs.adminQuestions')
  .controller('AdminQuestionsController', AdminQuestionsController);

  function AdminQuestionsController(Question, NgTableParams, $q, ngDialog) {
    var vm = this;

    vm.addQuestion = addQuestion;
    vm.editQuestion = editQuestion;
    vm.removeQuestion = removeQuestion;

    vm.tableParams = new NgTableParams({
      sorting: {
        name: 'desc'
      },
      page: 1,
      count: 10
    }, {
      counts: [],
      getData: function(params) {
        return $q(function(resolve) {
          Question.query()
          .$promise
          .then(function(questions) {

            params.total(questions.length);

            return resolve(questions);
          })
        })
      }
    });

    return;

    function questionDialog(options) {
      ngDialog.open(angular.extend({}, options, {
        className: 'ngdialog-theme-plain'
      }))
      .closePromise
      .then(function(message) {
        if (message && message.value) {
          vm.tableParams.reload();
        }
      });
    }

    function addQuestion() {
      questionDialog({
        controller: 'AddQuestionController',
        controllerAs: 'addQuestion',
        templateUrl: 'admin-questions/add-question/add-question.html',
      });
    }

    function editQuestion(row) {
      questionDialog({
        controller: 'EditQuestionController',
        controllerAs: 'editQuestion',
        templateUrl: 'admin-questions/edit-question/edit-question.html',
        resolve: {
          question: function() {
            return new Question(row);
          }
        }
      });
    }

    function removeQuestion(row) {
      (new Question(row))
      .$delete()
      .then(function() {
        vm.tableParams.reload();
      });
    }
  }
})();
