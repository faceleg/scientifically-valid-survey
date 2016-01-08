'use strict';
(function() {
  angular.module('svs.loginDialog')
    .factory('loginDialogService', loginDialogService);

  // @ngInject
  function loginDialogService($rootScope, ngDialog) {
    var isOpen = false;
    var dialog;

    var _loginDialogService = {
      login: function login() {
        if (isOpen) {
          return;
        }

        isOpen = true;
        dialog = ngDialog.open({
          template: 'login-dialog/login-dialog.html',
          controller: 'LoginDialogController',
          controllerAs: 'login',
          className: 'ngdialog-theme-plain',
          showClose: false,
          closeByEscape: false,
          closeByDocument: false,
          ariaDescribedBySelector: '.login-dialog__logo'
        })
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
