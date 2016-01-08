'use strict';
(function() {
  angular.module('svs.loginDialog')
    .factory('loginDialogService', loginDialogService);

  // @ngInject
  function loginDialogService($rootScope, ngDialog) {
    var isOpen = false;

    var _loginDialogService = {
      login: function login(options) {
        if (isOpen) {
          return;
        }

        isOpen = true;
        ngDialog.open(angular.extend({
          template: 'login-dialog/login-dialog.html',
          controller: 'LoginDialogController',
          controllerAs: 'login',
          className: 'ngdialog-theme-plain',
          showClose: false,
          closeByEscape: false,
          closeByDocument: false
        }, options || {}, {
          ariaDescribedBySelector: '.login-dialog__logo'
        }))
        .closePromise
        .then(function() {
          isOpen = false;
        });
      },
      cancel: function() {
        ngDialog.close();
        isOpen = false;
      },
      listen: function() {
        /* eslint-disable angular/on-watch */
        $rootScope.$on('user-notAuthenticated', function() {
          _loginDialogService.login();
        });
        $rootScope.$on('user-loginConfirmed', function() {
          ngDialog.close(dialog);
        });
        /* eslint-enable angular/on-watch */
      }
    };

    return _loginDialogService;
  }
})();
