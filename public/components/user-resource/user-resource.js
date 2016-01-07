'use strict';
(function() {

  angular.module('svs.userResource', [
    'ngResource',
    'rx',
    'angular-storage'
  ])
  .factory('User', UserResource);

  // @ngInject
  function UserResource(
    $resource, $http, $rootScope, $window, $q, rx, store, $location
  ) {

    var User = $resource('/api/users/:id', {
      id : '@id'
    }, {
      query: {
        method: 'GET',
        isArray: true
      },
      save: {method: 'PUT'},
      create: {method: 'POST'},
      destroy: {method: 'DELETE'},
      _current: {
        method: 'GET',
        url: '/api/users/current'
      }
    });

    // Instance methods

    User.prototype.logout = function logout() {
      return $http.post('/authentication/logout')
      .then(function() {
        store.remove('token');
        $location.path('/');
      });
    }

    // Static methods
    User.isLoggedIn = function() {
      return Boolean(store.get('token'));
    }

    User.login = function login(credentials) {
      return $http.post('/authentication/login', credentials)
      .then(function(response) {
        store.set('token', response.data.token);
        $rootScope.$broadcast('user-loginConfirmed', response.data.user);
        return response.data.user;
      });
    };

    var currentUserStream = new rx.ReplaySubject(1);
    User.updateCurrent = function updateCurrent() {
      User._current()
      .$promise
      .then(function(user) {
        currentUser = user;
        currentUserStream.onNext(currentUser);
      });
    };

    var currentUser;
    User.current = function current(subscriber) {
      if (!currentUser) {
        User.updateCurrent();
      }
      return currentUserStream.subscribe(subscriber);
    }

    return User;
  }
})();

