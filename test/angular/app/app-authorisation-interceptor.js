'use strict';
describe('authInterceptor config', function() {

  var $httpProvider;
  beforeEach(function() {
    angular.module('authInterceptorConfig', [])
      .config(function(_$httpProvider_) {
        $httpProvider = _$httpProvider_;
      });
    module('authInterceptorConfig');
    module('svs');
    inject();
  });

  it('should add the "authInterceptor" string to the interceptors list', function() {
    expect($httpProvider.interceptors.indexOf('authInterceptor')).toBeGreaterThan(-1);
  });
});

describe('authInterceptor actions', function() {
  beforeEach(module('svs'));

  var $authInterceptor;
  var $rootScope;
  var $location;
  beforeEach(function() {
    inject(function(_authInterceptor_, _$rootScope_, _$location_) {
      $authInterceptor = _authInterceptor_;
      $rootScope = _$rootScope_;
      $location = _$location_;
    });
  });

  it('should be defined', function() {
    expect($authInterceptor).toBeDefined();
  });

  it('should provide the correct properties', function() {
    expect($authInterceptor.responseError).toEqual(jasmine.any(Function));
  });

  it('should broadcast the correct event when a 401 response is intercepted', function() {
    var response = {
      status: 401,
      config: {
       url: '/some/path'
      }
    };

    spyOn($rootScope, '$broadcast');

    $authInterceptor.responseError(response);

    expect($rootScope.$broadcast).toHaveBeenCalledWith('user-notAuthenticated');
  });

  it('should not fire an event if at /authentication/login, thus allowing failed login attempts through', function() {
    var response = {
      status: 401,
      config: {
       url: '/authentication/login'
      }
    };

    $authInterceptor.responseError(response);
    spyOn($rootScope, '$broadcast');

    expect($rootScope.$broadcast).not.toHaveBeenCalled();
  });

  it('should broadcast the correct event when a 401 response is intercepted and not at /login', function() {
    var response = {
      status: 401,
      config: {
       url: '/some/path'
      }
    };

    spyOn($rootScope, '$broadcast');
    spyOn($location, 'path').and.callFake(function() {
      return '/login';
    });

    $authInterceptor.responseError(response);

    expect($rootScope.$broadcast).not.toHaveBeenCalled();
  });

  it('should retry the failed request if user-loginConfirmed is broadcast', function() {
    var response = {
      status: 401,
      config: {}
    };

    spyOn($rootScope, '$broadcast');
    spyOn($location, 'path').and.callFake(function() {
      return '/api/questions';
    });

    $authInterceptor.responseError(response);
    expect($rootScope.$broadcast).toHaveBeenCalled();
    expect($rootScope.$broadcast.calls.count()).toEqual(1);

    $rootScope.$broadcast('user-loginConfirmed');
    expect($rootScope.$broadcast.calls.count()).toEqual(2);
  });
});
