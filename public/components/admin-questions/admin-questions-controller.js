'use strict';

(function() {

  angular.module('svs.adminQuestions')
  .controller('AdminQuestionsController', AdminQuestionsController);

  function AdminQuestionsController(Question, NgTableParams, $q, ngDialog, Answer, User) {
    var vm = this;
    vm.error = null;
    vm.currentUser = null;

    vm.addQuestion = addQuestion;
    vm.editQuestion = editQuestion;
    vm.viewAnswers = viewAnswers;
    vm.removeQuestion = removeQuestion;

    vm.tableParams = new NgTableParams({
      sorting: {
        text: 'desc'
      },
      page: 1,
      count: 5
    }, {
      counts:[5, 10, 100],
      getData: getData
    });

    function getData(params) {
      return $q(function(resolve) {
        Question.query({
          orderBy: (function(sorting) {
            var key = Object.keys(sorting)[0];
            return [key, sorting[key]];
          })(params.sorting()),
          offset: params.page(),
          limit: params.count()
        })
        .$promise
        .then(function(response) {
          params.total(response.total);
          return resolve(response.data);
        })
      })
    }
    User.current(function(currentUser) {
      vm.currentUser = currentUser;
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
