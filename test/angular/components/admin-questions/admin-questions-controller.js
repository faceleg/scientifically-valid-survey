'use strict';

describe('admin questions controller', function() {

  beforeEach(module('ui.router'));
  beforeEach(module('ngTable'));
  beforeEach(module('ngDialog'));
  beforeEach(module('svs.templates'));
  beforeEach(module('svs.questionResource'));
  beforeEach(module('svs.userResource'));
  beforeEach(module('svs.answerResource'));
  beforeEach(module('svs.adminQuestions'));

  var questions = {
    data: [],
    total: 0
  };

  var Question;
  var Answer;
  var $rootScope;
  var $controller;
  var NgTableParams;
  var $httpBackend;
  var $q;
  var ngDialog;
  beforeEach(inject(function(
    _$controller_, _$rootScope_, _Question_, _Answer_, _$httpBackend_,
    _NgTableParams_, _$q_, _ngDialog_
  ) {
    Question = _Question_;
    Answer = _Answer_;
    $rootScope = _$rootScope_;
    $controller = _$controller_;
    $httpBackend = _$httpBackend_;
    NgTableParams = _NgTableParams_;
    $q = _$q_;
    ngDialog = _ngDialog_;
  }));

  function controller($scope) {
    $scope = $scope || $rootScope.$new();

    return $controller('AdminQuestionsController', {
      Question: Question,
      NgTableParams: NgTableParams,
      $q: $q,
      ngDialog: ngDialog,
      Answer: Answer
    });
  }

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should set the correct properties on vm', function() {
    $httpBackend.expect('GET', '/api/users/current')
    .respond(200, {});
    $httpBackend.when('GET', '/api/questions')
    .respond(200, questions);

    var AdminQuestionsController = controller();
    expect(AdminQuestionsController.error).toBeNull();
    expect(AdminQuestionsController.addQuestion).toEqual(jasmine.any(Function));
    expect(AdminQuestionsController.editQuestion).toEqual(jasmine.any(Function));
    expect(AdminQuestionsController.removeQuestion).toEqual(jasmine.any(Function));
    expect(AdminQuestionsController.viewAnswers).toEqual(jasmine.any(Function));
    $httpBackend.flush();
  });

  it('should open an ngDialog when addQuestion is called', function() {
    $httpBackend.expect('GET', '/api/users/current')
    .respond(200, {});
    spyOn(ngDialog, 'open').and.callFake(function(options) {
      expect(options.controller).toEqual('AddQuestionController');
      expect(options.controllerAs).toEqual('addQuestion');
      expect(options.templateUrl).toEqual('admin-questions/add-question/add-question.html');
      return {
        closePromise: $q(angular.noop)
      }
    });

    var AdminQuestionsController = controller();
    AdminQuestionsController.addQuestion();
    $httpBackend.flush();
  });

  it('should reload the table when a dialog is closed with a truthy value', function() {
    $httpBackend.expect('GET', '/api/users/current')
    .respond(200, {});
    var AdminQuestionsController = controller();

    spyOn(AdminQuestionsController.tableParams, 'reload');
    spyOn(ngDialog, 'open').and.callFake(function() {
      return {
        closePromise: $q(function(resolve) {
          resolve({
            value: true
          });
        })
      }
    });

    AdminQuestionsController.addQuestion();

    $rootScope.$digest();

    expect(AdminQuestionsController.tableParams.reload).toHaveBeenCalled();
    $httpBackend.flush();
  });

  it('should not reload the table when a dialog is closed with a truthy value', function() {
    $httpBackend.expect('GET', '/api/users/current')
    .respond(200, {});
    var AdminQuestionsController = controller();

    spyOn(AdminQuestionsController.tableParams, 'reload');
    spyOn(ngDialog, 'open').and.callFake(function() {
      return {
        closePromise: $q(function(resolve) {
          resolve({
            value: false
          });
        })
      }
    });

    AdminQuestionsController.addQuestion();

    $rootScope.$digest();

    expect(AdminQuestionsController.tableParams.reload).not.toHaveBeenCalled();
    $httpBackend.flush();
  });

  it('should open an ngDialog when editQuestion is called', function() {
    $httpBackend.expect('GET', '/api/users/current')
    .respond(200, {});
    spyOn(ngDialog, 'open').and.callFake(function(options) {
      expect(options.controller).toEqual('EditQuestionController');
      expect(options.controllerAs).toEqual('editQuestion');
      expect(options.templateUrl).toEqual('admin-questions/edit-question/edit-question.html');
      expect(options.resolve.question).toEqual(jasmine.any(Function));
      return {
        closePromise: $q(angular.noop)
      }
    });

    var AdminQuestionsController = controller();
    AdminQuestionsController.editQuestion({
      id: 1
    });
    $httpBackend.flush();
  });

  it('should delete the given question when removeQuestion is called', function() {
    $httpBackend.expect('GET', '/api/users/current')
    .respond(200, {});
    $httpBackend.when('GET', '/api/questions?limit=5&offset=1&orderBy=text&orderBy=desc')
    .respond(200, questions);
    $httpBackend.expect('DELETE', '/api/questions/1')
    .respond(204);

    var AdminQuestionsController = controller();

    AdminQuestionsController.removeQuestion({
      id: 1
    });

    $httpBackend.flush();
  });

  it('should open an ngDialog when viewAnswers is called', function() {
    $httpBackend.expect('GET', '/api/users/current')
    .respond(200, {});
    spyOn(ngDialog, 'open').and.callFake(function(options) {
      expect(options.controller).toEqual('ViewAnswersController');
      expect(options.controllerAs).toEqual('viewAnswers');
      expect(options.templateUrl).toEqual('admin-questions/view-answers/view-answers.html');
      expect(options.resolve.question).toEqual(jasmine.any(Function));
      expect(options.resolve.answers).toEqual(jasmine.any(Function));
      return {
        closePromise: $q(angular.noop)
      }
    });

    var AdminQuestionsController = controller();
    AdminQuestionsController.viewAnswers({
      id: 1
    });

    $httpBackend.flush();
  });

  it('should attempt to resolve the given dependiencies when viewAnswers is called', function() {
    $httpBackend.expect('GET', '/api/users/current')
    .respond(200, {});
    $httpBackend.expect('GET', '/api/answers?questionId=1')
    .respond(200, []);

    var AdminQuestionsController = controller();
    AdminQuestionsController.viewAnswers({
      id: 1
    });

    $httpBackend.flush();
  });
});
