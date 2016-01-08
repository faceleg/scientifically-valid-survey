'use strict';
describe('login dialog', function() {

  beforeEach(module('ngDialog'));
  beforeEach(module('svs.loginDialog'));

  var loginDialogService;
  var ngDialog;
  var $q;
  beforeEach(inject(function(_loginDialogService_, _ngDialog_, _$q_) {
    loginDialogService = _loginDialogService_;
    ngDialog = _ngDialog_;
    $q = _$q_;
  }));

  describe('login', function() {

    it('should be available', function() {
      expect(loginDialogService.login).toBeDefined();
      expect(loginDialogService.login).toEqual(jasmine.any(Function));
    });

    it('should call the ngDialog open function', function() {
      spyOn(ngDialog, 'open').and.callThrough();
      loginDialogService.login();
      expect(ngDialog.open).toHaveBeenCalled();
    });

    it('should call the ngDialog open function only if the dialog is not already open', function() {
      spyOn(ngDialog, 'open').and.callFake(function() {
        return {
          id: 1,
          closePromise: $q.resolve()
        };
      });
      spyOn(ngDialog, 'isOpen').and.callFake(function() {
        return true;
      });

      loginDialogService.login();
      loginDialogService.login();
      expect(ngDialog.open.calls.count()).toBe(1);
    });

  });

  it('should hide the dialog if a user-loginConfirmed event is broadcast',
      inject(function($rootScope, $location) {
    spyOn($location, 'path');
    spyOn(ngDialog, 'close');
    loginDialogService.listen();

    loginDialogService.login();

    $rootScope.$broadcast('user-loginConfirmed', {});

    expect($location.path).not.toHaveBeenCalled();
    expect(ngDialog.close).toHaveBeenCalled();
  }));

  it('should show the dialog if a user-notAuthenticated event is broadcast',
      inject(function($rootScope) {
    spyOn(ngDialog, 'open').and.callThrough();
    loginDialogService.listen();

    $rootScope.$broadcast('user-notAuthenticated', {});

    expect(ngDialog.open).toHaveBeenCalled();
  }));

  it('should hide the dialog if a $stateChangeStart event is broadcast for state home',
      inject(function($rootScope, $location) {
    spyOn($location, 'path');
    spyOn(ngDialog, 'close');
    loginDialogService.listen();

    loginDialogService.login();

    $rootScope.$broadcast('$stateChangeStart', {
      name: 'home'
    });

    expect($location.path).not.toHaveBeenCalled();
    expect(ngDialog.close).toHaveBeenCalled();
  }));
  it('should close the dialog if the cancel method is called', inject(function() {
    spyOn(ngDialog, 'close');

    loginDialogService.login({
      redirect: false
    });

    loginDialogService.cancel();

    expect(ngDialog.close).toHaveBeenCalled();
  }));

  afterEach(function() {
    ngDialog.closeAll();
  });
});

