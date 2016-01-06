'use strict';

(function() {

  angular.module('svs.adminQuestions')
  .controller('AdminQuestionsController', AdminQuestionsController);

  function AdminQuestionsController(Question, NgTableParams, $q, ngDialog, Answer) {

    authenticationCheck();

    var vm = this;
    vm.error = null;

    vm.addQuestion = addQuestion;
    vm.editQuestion = editQuestion;
    vm.viewAnswers = viewAnswers;
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
        className: 'ngdialog-theme-plain admin-questions-dialog'
      }))
      .closePromise
      .then(function(message) {
        if (message && message.value) {
          vm.tableParams.reload();
        }
      });
    }

    function authenticationCheck() {
      if (localStorage.getItem('usePowersForMostlyGood')) {
        return;
      }

      questionDialog({
        controller: 'AuthenticationCheckController',
        controllerAs: 'authenticationCheck',
        templateUrl: 'admin-questions/authentication-check/authentication-check.html'
      })
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
            return new Question(angular.copy(row));
          }
        }
      });
    }

    function viewAnswers(row) {
      questionDialog({
        controller: 'ViewAnswersController',
        controllerAs: 'viewAnswers',
        templateUrl: 'admin-questions/view-answers/view-answers.html',
        resolve: {
          question: function() {
            return new Question(angular.copy(row));
          },
          answers: function() {
            return Answer.query({
              questionId: row.id
            });
          }
        }
      });
    }

    function removeQuestion(row) {
      (new Question(row))
      .$delete()
      .then(function() {
        vm.tableParams.reload();
      })
      .catch(function(response) {
        vm.error = response.data;
      });
    }
  }
})();
