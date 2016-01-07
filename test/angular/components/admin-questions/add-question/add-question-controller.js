'use strict';

describe('admin add question controller', function() {

  beforeEach(module('ui.router'));
  beforeEach(module('svs.templates'));
  beforeEach(module('svs.questionResource'));
  beforeEach(module('svs.userResource'));
  beforeEach(module('svs.answerResource'));
  beforeEach(module('svs.adminQuestions'));

  var Question;
  var Choice;
  var $rootScope;
  var $controller;
  var $httpBackend;
  var $q;
  beforeEach(inject(function(
    _$controller_, _$rootScope_, _Question_, _Choice_, _$httpBackend_, _$q_
  ) {
    Question = _Question_;
    Choice = _Choice_;
    $rootScope = _$rootScope_;
    $controller = _$controller_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
  }));

  function controller($scope) {
    $scope = $scope || $rootScope.$new();
    $scope.closeThisDialog = angular.noop;

    return $controller('AddQuestionController', {
      $scope: $scope,
      Question: Question,
      Choice: Choice,
      $q: $q
    });
  }

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should set the correct properties on vm', function() {
    var AddQuestionController = controller();

    expect(AddQuestionController.errors).toEqual([]);
    expect(AddQuestionController.close).toEqual(jasmine.any(Function));
    expect(AddQuestionController.saveQuestion).toEqual(jasmine.any(Function));
    expect(AddQuestionController.removeChoice).toEqual(jasmine.any(Function));
    expect(AddQuestionController.question).toEqual(jasmine.any(Object));
    expect(AddQuestionController.addChoice).toEqual(jasmine.any(Function));
  });

  it('should add a choice when addChoice is called', function() {
    var AddQuestionController = controller();
    AddQuestionController.choices = [];
    AddQuestionController.addChoice();
    expect(AddQuestionController.choices.length).toEqual(1);
  });

  it('should remove choice from choices array when removeChoice is called', function() {
    var AddQuestionController = controller();
    AddQuestionController.choices = [1];
    AddQuestionController.removeChoice(0);
    expect(AddQuestionController.choices.length).toEqual(0);
  });

  it('should reset errors on save', function() {
    $httpBackend.when('POST', '/api/questions')
    .respond(200, {});
    $httpBackend.when('POST', '/api/choices')
    .respond(200, {});

    var AddQuestionController = controller();
    AddQuestionController.errors = [1];
    AddQuestionController.saveQuestion();
    expect(AddQuestionController.errors.length).toEqual(0);
    $httpBackend.flush();
  });

  it('should POST to the correct endpoints on saveQuestion', function() {
    $httpBackend.expect('POST', '/api/questions')
    .respond(200, {});
    $httpBackend.expect('POST', '/api/choices')
    .respond(200, {});

    var AddQuestionController = controller();
    AddQuestionController.saveQuestion();
    $httpBackend.flush();
  });

  it('should set the errors properly on a failed question request', function() {
    $httpBackend.expect('POST', '/api/questions')
    .respond(400, 'an error');

    var AddQuestionController = controller();
    AddQuestionController.saveQuestion();
    $httpBackend.flush();

    expect(AddQuestionController.errors[0]).toEqual('an error');
  });

  it('should set the errors properly on a failed choice request', function() {
    $httpBackend.expect('POST', '/api/questions')
    .respond(200, {});
    $httpBackend.expect('POST', '/api/choices')
    .respond(400, 'an error');

    var AddQuestionController = controller();
    AddQuestionController.saveQuestion();
    $httpBackend.flush();

    expect(AddQuestionController.errors[0]).toEqual('an error');
  });
});
