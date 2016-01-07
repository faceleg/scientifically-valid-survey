'use strict';

describe('admin edit question controller', function() {

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
  var question;
  beforeEach(inject(function(
    _$controller_, _$rootScope_, _Question_, _Choice_, _$httpBackend_, _$q_
  ) {
    Question = _Question_;
    Choice = _Choice_;
    $rootScope = _$rootScope_;
    $controller = _$controller_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;

    question = new Question({
      id: 3,
      text: 'This is a question',
      choices: [
        {
          id: 1,
          text: 'Choice 1'
        },
        {
          text: 'Choice 1'
        }
      ]
    });
  }));

  function controller($scope) {
    $scope = $scope || $rootScope.$new();
    $scope.closeThisDialog = angular.noop;

    return $controller('EditQuestionController', {
      $scope: $scope,
      Question: Question,
      Choice: Choice,
      $q: $q,
      question: question
    });
  }

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should set the correct properties on vm', function() {
    var EditQuestionController = controller();

    expect(EditQuestionController.errors).toEqual([]);
    expect(EditQuestionController.choicesToRemove).toEqual([]);
    expect(EditQuestionController.choices[0].id).toEqual(question.choices[0].id);
    expect(EditQuestionController.close).toEqual(jasmine.any(Function));
    expect(EditQuestionController.saveQuestion).toEqual(jasmine.any(Function));
    expect(EditQuestionController.removeChoice).toEqual(jasmine.any(Function));
    expect(EditQuestionController.question).toEqual(jasmine.any(Object));
    expect(EditQuestionController.addChoice).toEqual(jasmine.any(Function));
  });

  it('should add a choice when addChoice is called', function() {
    var EditQuestionController = controller();
    EditQuestionController.choices = [];
    EditQuestionController.addChoice();
    expect(EditQuestionController.choices.length).toEqual(1);
  });

  it('should remove choice from choices array and add it to choicesToRemove when removeChoice is called', function() {
    var EditQuestionController = controller();
    var choiceId = question.choices[0].id;
    EditQuestionController.removeChoice(0);
    expect(EditQuestionController.choices.length).toEqual(2);
    expect(EditQuestionController.choicesToRemove[0].id).toEqual(choiceId);
  });

  it('should remove choice from choices array but not add it to choicesToRemove when removeChoice is called for a choice with no id', function() {
    var EditQuestionController = controller();
    EditQuestionController.removeChoice(1);
    expect(EditQuestionController.choices.length).toEqual(2);
    expect(EditQuestionController.choicesToRemove.length).toEqual(0);
  });

  it('should reset errors on save', function() {
    $httpBackend.when('PUT', '/api/questions/3')
    .respond(200, {});
    $httpBackend.when('PUT', '/api/choices/1')
    .respond(200, {});
    $httpBackend.when('POST', '/api/choices')
    .respond(200, {});

    var EditQuestionController = controller();
    EditQuestionController.errors = [1];
    EditQuestionController.saveQuestion();
    expect(EditQuestionController.errors.length).toEqual(0);
    $httpBackend.flush();
  });

  it('should POST to the correct endpoints on saveQuestion', function() {
    $httpBackend.expect('PUT', '/api/questions/3')
    .respond(200, {});
    $httpBackend.expect('PUT', '/api/choices/1')
    .respond(200, {});
    $httpBackend.when('POST', '/api/choices')
    .respond(200, {});

    var EditQuestionController = controller();
    EditQuestionController.saveQuestion();
    $httpBackend.flush();
  });

  it('should set the errors properly on a failed question request', function() {
    $httpBackend.expect('PUT', '/api/questions/3')
    .respond(400, 'an error');

    var EditQuestionController = controller();
    EditQuestionController.saveQuestion();
    $httpBackend.flush();

    expect(EditQuestionController.errors[0]).toEqual('an error');
  });

  it('should set the errors properly on a failed choice PUT request', function() {
    $httpBackend.expect('PUT', '/api/questions/3')
    .respond(200, {});
    $httpBackend.expect('PUT', '/api/choices/1')
    .respond(400, 'an error');
    $httpBackend.when('POST', '/api/choices')
    .respond(200, {});

    var EditQuestionController = controller();
    EditQuestionController.saveQuestion();
    $httpBackend.flush();

    expect(EditQuestionController.errors[0]).toEqual('an error');
  });

  it('should set the errors properly on a failed choice POST request', function() {
    $httpBackend.expect('PUT', '/api/questions/3')
    .respond(200, {});
    $httpBackend.expect('PUT', '/api/choices/1')
    .respond(200, {});
    $httpBackend.when('POST', '/api/choices')
    .respond(400, 'an error');

    var EditQuestionController = controller();
    EditQuestionController.saveQuestion();
    $httpBackend.flush();

    expect(EditQuestionController.errors[0]).toEqual('an error');
  });

  it('should make DELETE calls for choicesToRemove', function() {
    $httpBackend.expect('PUT', '/api/questions/3')
    .respond(200, {});
    $httpBackend.expect('DELETE', '/api/choices/1')
    .respond(200, {});
    $httpBackend.when('POST', '/api/choices')
    .respond(200, {});

    var EditQuestionController = controller();
    EditQuestionController.removeChoice(0);
    EditQuestionController.removeChoice(0);
    EditQuestionController.saveQuestion();
    $httpBackend.flush();
  });
});
