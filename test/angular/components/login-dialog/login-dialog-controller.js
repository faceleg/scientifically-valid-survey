'use strict';

describe('login dialog', function() {

  beforeEach(module('svs.userResource'));
  beforeEach(module('svs.loginDialog'));

  var $httpBackend;
  var LoginDialogController;
  var $location;
  beforeEach(inject(function(_$controller_, _$httpBackend_, _$location_, _User_) {
    $httpBackend = _$httpBackend_;
    $location = _$location_;
    LoginDialogController = _$controller_('LoginDialogController', {
      User: _User_,
      $location: $location
    });
  }));

  describe('controller', function() {

    it('should have the correct properties exposed', function() {
      expect(LoginDialogController.user).toEqual({
        email: '',
        password: ''
      });
      expect(LoginDialogController.login).toEqual(jasmine.any(Function));
    });

    it('should attempt to login when appropriate and handle error', function() {
      $httpBackend.when('POST', '/authentication/login', {
          email: '',
          password: ''
        })
        .respond(401, {
          code: 401,
          message: 'The message'
        });

      LoginDialogController.login();

      $httpBackend.flush();
      expect(LoginDialogController.error).toEqual({
        code: 401,
        message: 'The message'
      });
    });

    it('should redirect to /admin/questions on success', function() {
      $httpBackend.when('POST', '/authentication/login', {
          email: '',
          password: ''
        })
        .respond(200, {
          token: 'a token'
        });
      $httpBackend.when('GET', '/api/users/current')
        .respond(200);

      spyOn($location, 'path');
      LoginDialogController.login();

      $httpBackend.flush();
      expect(LoginDialogController.error).toEqual(null);
      expect($location.path).toHaveBeenCalledWith('/admin/questions');
    });
  });
});

