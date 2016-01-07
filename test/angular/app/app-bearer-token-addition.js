'use strict';
describe('bearerTokenAddition config', function() {

  beforeEach(module('angular-storage'));

  var $httpProvider;
  beforeEach(function() {
    angular.module('bearerTokenAdditionConfig', [])
      .config(function(_$httpProvider_) {
        $httpProvider = _$httpProvider_;
      });
    module('bearerTokenAdditionConfig');
    module('svs');
    inject();
  });

  it('should add the "bearerTokenAddition" string to the interceptors list', function() {
    expect($httpProvider.interceptors.indexOf('bearerTokenAddition')).toBeGreaterThan(-1);
  });
});

describe('bearerTokenAddition actions', function() {

  beforeEach(module('angular-storage'));
  beforeEach(module('svs'));

  var $bearerTokenAddition;
  var store;
  beforeEach(function() {
    inject(function(_bearerTokenAddition_, _store_) {
      $bearerTokenAddition = _bearerTokenAddition_;
      store = _store_;
    });
  });

  it('should be defined', function() {
    expect($bearerTokenAddition).toBeDefined();
  });

  it('should provide the correct properties', function() {
    expect($bearerTokenAddition.request).toEqual(jasmine.any(Function));
  });

  it('should set the correct Bearer token on outgoing reqeusts', function() {
    var token = 'the token';
    store.set('token', token);

    var config = {};
    $bearerTokenAddition.request(config);

    expect(config.headers.Authorization).toBeDefined();
    expect(config.headers.Authorization).toEqual('Bearer ' + token);

    store.remove('token');

    config = {};
    $bearerTokenAddition.request(config);

    expect(config.headers.Authorization).not.toBeDefined();
  });

  it('should not set the bearer token on requests to different domains', function() {
    var token = 'the token';
    store.set('token', token);

    var config = {
      headers: {},
      url: 'http://differentdomain.notatld'
    };
    $bearerTokenAddition.request(config);

    expect(config.headers.Authorization).not.toBeDefined();

    config.url = '/root-relative';
    $bearerTokenAddition.request(config);

    expect(config.headers.Authorization).toBeDefined();
    expect(config.headers.Authorization).toEqual('Bearer ' + token);

    config.url = 'relative';
    $bearerTokenAddition.request(config);

    expect(config.headers.Authorization).toBeDefined();
    expect(config.headers.Authorization).toEqual('Bearer ' + token);
  });
});

