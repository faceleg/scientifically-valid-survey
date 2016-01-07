'use strict';

describe('home controller', function() {

  beforeEach(module('ui.router'));
  beforeEach(module('svs.questionResource'));
  beforeEach(module('svs.answerResource'));
  beforeEach(module('svs.home'));

  var randomQuestion = {
    id: 123,
    text: 'This is some text'
  };

  var Question;
  var Answer;
  var $rootScope;
  var $controller;
  var $httpBackend;
  beforeEach(inject(function(_$controller_, _$rootScope_, _Question_, _Answer_, _$httpBackend_) {
    Question = _Question_;
    Answer = _Answer_;
    $rootScope = _$rootScope_;
    $controller = _$controller_;
    $httpBackend = _$httpBackend_;
  }));

  function controller($scope) {
    $scope = $scope || $rootScope.$new();

    return $controller('HomeController', {
      Question: Question,
      Answer: Answer
    });
  }

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should set the correct properties on vm', function() {
    $httpBackend.when('GET', '/public-api/questions/random')
    .respond(200, randomQuestion);

    var HomeController = controller();
    expect(HomeController.success).toBeNull();
    expect(HomeController.error).toBeNull();
    expect(HomeController.question).toBeNull();
    expect(HomeController.answer).toEqual(jasmine.any(Object));
    expect(HomeController.saveAnswer).toEqual(jasmine.any(Function));

    $httpBackend.flush();
  });

  it('should populate vm.question with a random question', function() {
    $httpBackend.when('GET', '/public-api/questions/random')
    .respond(200, randomQuestion);

    var HomeController = controller();
    $httpBackend.flush();
    expect(HomeController.question.text).toEqual(randomQuestion.text);
  });

  it('should populate vm.error if random question call fails', function() {
    $httpBackend.when('GET', '/public-api/questions/random')
    .respond(404, 'No more questions');

    var HomeController = controller();
    $httpBackend.flush();
    expect(HomeController.question).toBeNull();
    expect(HomeController.error).toEqual('No more questions');
  });

  it('should call resource.$save when saveAnswer is called, and set vm.success', function() {
    $httpBackend.when('GET', '/public-api/questions/random')
    .respond(200, randomQuestion);

    var HomeController = controller();
    $httpBackend.flush();

    HomeController.answer.choiceId = 1;

    $httpBackend.when('POST', '/api/answers')
    .respond(200, {
      id: 456,
      choiceId: 1
    });
    spyOn(HomeController.answer, '$save').and.callThrough();

    HomeController.saveAnswer();
    expect(HomeController.answer.$save).toHaveBeenCalled();

    $httpBackend.flush();

    expect(HomeController.success).toEqual('Your excellent answer was saved, do more science!');
    expect(HomeController.answer.choicedId).toBeUndefined();
  });

  it('should populate vm.error if an answer save fails', function() {
    $httpBackend.when('GET', '/public-api/questions/random')
    .respond(200, randomQuestion);

    var HomeController = controller();
    $httpBackend.flush();

    HomeController.answer.choiceId = 1;

    $httpBackend.when('POST', '/api/answers')
    .respond(400, 'Bad request');
    spyOn(HomeController.answer, '$save').and.callThrough();

    HomeController.saveAnswer();

    $httpBackend.flush();

    expect(HomeController.error).toEqual('Bad request');
  });
});
