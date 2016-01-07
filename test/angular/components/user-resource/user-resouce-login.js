'use strict';
describe('user resource', function() {

  beforeEach(module('ngResource'));
  beforeEach(module('angular-storage'));
  beforeEach(module('svs.userResource'));

  var $httpBackend;
  var $rootScope;
  var User;
  var store;
  beforeEach(inject(function(_$httpBackend_, _$rootScope_, _User_, _store_) {
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    User = _User_;
    store = _store_;
  }));

  afterEach(function() {
    store.remove('token');
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('User', function() {

    describe('login', function() {
      it('should return a promise', function() {
        $httpBackend.when('POST', '/authentication/login', {})
        .respond(200, {
          token: 'token',
          user: {}
        });
        expect(User.login({}).then).toEqual(jasmine.any(Function));
        $httpBackend.flush();
      });

      it('should broadcast the correct event when login is successful', function() {
        spyOn($rootScope, '$broadcast').and.returnValue({
          preventDefault: true
        });
        $httpBackend.when('POST', '/authentication/login', {})
        .respond(200, {
          token: 'token',
          user: {}
        });

        User.login({})
        .then(function(user) {
          expect($rootScope.$broadcast).toHaveBeenCalledWith('user-loginConfirmed', user);
        });
        $httpBackend.flush();
      });

      it('should set the login token on success', function() {
        $httpBackend.when('POST', '/authentication/login', {})
        .respond(200, {
          token: 'token',
          user: {}
        });

        User.login({})
        .then(function() {
          expect(store.get('token')).toEqual('token');
        });
        $httpBackend.flush();
      });

      it('should reject the promise when login fails', function() {
        $httpBackend.when('POST', '/authentication/login', {})
        .respond(401, {
          code: 401
        });

        User.login({})
        .catch(function(response) {
          expect(response.data.code).toEqual(401);
        });

        $httpBackend.flush();
      });
    });
  });
});

