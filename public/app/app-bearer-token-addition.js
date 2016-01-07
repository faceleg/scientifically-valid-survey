'use strict';
(function() {
  angular.module('svs')
    .factory('bearerTokenAddition', bearerTokenAddition);

  // @ngInject
  function bearerTokenAddition($rootScope, $q, store, $location) {
    var hostRegexp = new RegExp('^' + $location.protocol() + '://' + $location.host());

    return {
      request: function(config) {

        // Only add bearer token to requests to this domain
        if (config.url && config.url[0] === 'h' && !hostRegexp.test(config.url)) {
          return config;
        }

        config.headers = config.headers || {};
        if (store.get('token')) {
          config.headers.Authorization = 'Bearer ' + store.get('token');
        }
        return config;
      }
    };
  }
  angular.module('svs')
    .config(bearerTokenAdditionConfig);

  // @ngInject
  function bearerTokenAdditionConfig($httpProvider) {
    $httpProvider.interceptors.push('bearerTokenAddition');
  }
})();

