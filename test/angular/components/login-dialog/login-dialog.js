'use strict';
describe('login dialog', function() {

  beforeEach(module('ngDialog'));
  beforeEach(module('svs.loginDialog'));

  var loginDialogService;
  var ngDialog;
  beforeEach(inject(function(_loginDialogService_, _ngDialog_) {
    loginDialogService = _loginDialogService_;
    ngDialog = _ngDialog_;
  }));

  describe('login', function() {

    it('should be available', function() {
      expect(loginDialogService.login).toBeDefined();
      expect(loginDialogService.login).toEqual(jasmine.any(Function));
    });

    it('should call the ngDialog open function', function() {
      spyOn(ngDialog, 'open');
      loginDialogService.login();
      expect(ngDialog.open).toHaveBeenCalled();
    });

    it('should call the ngDialog open function only if the dialog is not already open', function() {
      spyOn(ngDialog, 'open').and.callFake(function() {
        return {
          id: 1
        };
      });
      spyOn(ngDialog, 'isOpen').and.callFake(function() {
        return true;
      });

      loginDialogService.login();
      loginDialogService.login();
      expect(ngDialog.open.calls.count()).toBe(1);
    });

    it('calls the ngDialog open function with the provided options', function() {
      spyOn(ngDialog, 'open');

      var options = {
        a: 'b',
        c: 'd',
        e: 'f'
      };

      loginDialogService.login(options);
      expect(ngDialog.open.calls.count()).toBe(1);

      var calledOptions = ngDialog.open.calls.mostRecent().args[0];
      expect(options.a).toEqual(calledOptions.a);
      expect(options.c).toEqual(calledOptions.c);
      expect(options.e).toEqual(calledOptions.e);
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
    spyOn(ngDialog, 'open');
    loginDialogService.listen();

    $rootScope.$broadcast('user-notAuthenticated', {});

    expect(ngDialog.open).toHaveBeenCalled();
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

