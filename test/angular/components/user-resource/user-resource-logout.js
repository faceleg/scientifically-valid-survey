'use strict';
describe('user resource', function() {

  beforeEach(module('ngResource'));
  beforeEach(module('angular-storage'));
  beforeEach(module('svs.userResource'));

  var $httpBackend;
  var User;
  var store;
  var $location;
  beforeEach(inject(function(_$httpBackend_, _User_, _store_, _$location_) {
    $httpBackend = _$httpBackend_;
    User = _User_;
    store = _store_;
    $location = _$location_;
  }));

  afterEach(function() {
    store.remove('token');
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('User', function() {
    describe('logout', function() {
      var user;
      beforeEach(inject(function() {
        user = new User({
          id: 1,
          name: 'a name',
          email: 'test@66pix.com'
        });
      }));

      it('should exist', function() {
        expect(user.logout).toEqual(jasmine.any(Function));
      });

      it('should call the correct endpoint with the correct verb', function() {
        $httpBackend.when('POST', '/authentication/logout')
        .respond(200, {});

        user.logout();

        $httpBackend.flush();
      });

      it('should return a promise', function() {
        $httpBackend.when('POST', '/authentication/logout')
        .respond(200, {});

        var logoutPromise = user.logout();

        expect(logoutPromise.then).toEqual(jasmine.any(Function));
        expect(logoutPromise.catch).toEqual(jasmine.any(Function));

        $httpBackend.flush();
      });

      it('should delete the login token on success', function() {
        store.set('token', 'something');
        $httpBackend.when('POST', '/authentication/logout')
        .respond(200, {});

        user.logout()
        .then(function() {
          expect(store.get('token')).toBeNull();
        });

        $httpBackend.flush();
      });

      it('should delete the login token on success', function() {
        store.set('token', 'something');
        $httpBackend.when('POST', '/authentication/logout')
        .respond(200, {});

        user.logout()
        .then(function() {
          expect(store.get('token')).toBeNull();
        });

        $httpBackend.flush();
      });

      it('should redirect to / on success', function() {
        spyOn($location, 'path').and.callFake(angular.noop);
        $httpBackend.when('POST', '/authentication/logout')
        .respond(200, {});

        user.logout()
        .then(function() {
          expect($location.path).toHaveBeenCalledWith('/');
        });

        $httpBackend.flush();
      });
    });
  });
});

