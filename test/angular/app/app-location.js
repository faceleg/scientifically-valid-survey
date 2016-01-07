'use strict';
describe('locationProvider config', function() {

  var $locationProvider;
  beforeEach(function() {
    angular.module('locationProviderConfig', [])
      .config(function(_$locationProvider_) {
        $locationProvider = _$locationProvider_;
        spyOn($locationProvider, 'html5Mode');
        spyOn($locationProvider, 'hashPrefix');
      });
    module('locationProviderConfig');
    module('svs');
    inject();
  });

  it('should set html5 mode', function() {
    expect($locationProvider.html5Mode)
      .toHaveBeenCalledWith(true);
  });

  it('should use ! as the hash prefix', function() {
    expect($locationProvider.hashPrefix)
      .toHaveBeenCalledWith('!');
  });
});

