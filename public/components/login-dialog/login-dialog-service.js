'use strict';
(function() {
  angular.module('svs.loginDialog')
    .factory('loginDialogService', loginDialogService);

  // @ngInject
  function loginDialogService($rootScope, ngDialog) {
    var dialog = null;

    var _loginDialogService = {
      login: function login(options) {
        if (dialog && ngDialog.isOpen(dialog.id)) {
          return;
        }
        dialog = ngDialog.open(angular.extend({
          template: 'login-dialog/login-dialog.html',
          controller: 'LoginDialogController',
          controllerAs: 'login',
          className: 'ngdialog-theme-plain'
        }, options || {}, {
          ariaDescribedBySelector: '.login-dialog__logo'
        }));
      },
      cancel: function() {
        ngDialog.close();
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
