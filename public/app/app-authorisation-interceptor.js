'use strict';
(function() {

  angular.module('svs')
    .factory('authInterceptor', authInterceptor);

  // @ngInject
  function authInterceptor($rootScope, $q, $location, $injector) {
    return {
      responseError: function(response) {
        if (!/^\/admin/.test($location.path())) {
          return $q.resolve(response.config);
        }

        if (response.status === 401 && $location.path() !== '/login') {
          $rootScope.$broadcast('user-notAuthenticated');
          return $q(function(resolve) {
            /* eslint-disable angular/on-watch */
            $rootScope.$on('user-loginConfirmed', function() {
              var $http = $injector.get('$http');
              resolve($http(response.config));
            });
            /* eslint-enable angular/on-watch */
          });
        }
        return $q.reject(response);
      }
    };
  }

  angular.module('svs')
    .config(authInterceptorConfig);

  function authInterceptorConfig($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  }
})();
