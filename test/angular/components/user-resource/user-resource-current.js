'use strict';
describe('user resource', function() {

  beforeEach(module('ngResource'));
  beforeEach(module('svs.userResource'));

  var $httpBackend;
  var User;
  beforeEach(inject(function(_$httpBackend_, _User_) {
    $httpBackend = _$httpBackend_;
    User = _User_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('User', function() {
    describe('current', function() {
      it('should GET to /api/users/current when _current is called', function() {
        $httpBackend.when('GET', '/api/users/current')
        .respond(200, {});

        User._current();
        $httpBackend.flush();
      });

      it('should return a subscription', function() {
        $httpBackend.when('GET', '/api/users/current')
        .respond(200, {});

        expect(User.current().isDisposed).toEqual(false);
        expect(User.current()).toEqual(jasmine.any(Object));

        $httpBackend.flush();
      });

      it('should react with the current user', function() {
        $httpBackend.when('GET', '/api/users/current')
        .respond(200, {
          email: 'active@66pix.com'
        });

        User.current(function(user) {
          expect(user.email).toEqual('active@66pix.com');
        });

        $httpBackend.flush();
      });

      it('should update with the current user when updateCurrent is called', function() {
        $httpBackend.when('GET', '/api/users/current')
        .respond(200, {
          email: 'active@66pix.com'
        });

        var count = 0;
        User.current(function(user) {
          count += 1;
          expect(user.email).toEqual('active@66pix.com');
        });

        User.updateCurrent();

        $httpBackend.flush();

        expect(count).toEqual(2);
      });
    });
  });
});

