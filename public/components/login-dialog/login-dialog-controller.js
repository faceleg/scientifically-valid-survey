'use strict';
(function() {

  angular.module('svs.loginDialog')
  .controller('LoginDialogController', LoginDialogController);

  // @ngInject
  function LoginDialogController(User, $location) {
    var vm = this;
    vm.login = login;
    vm.error = null;
    vm.user = {
      email: '',
      password: ''
    };

    return;

    function login() {
      vm.error = null;
      return User.login(vm.user)
      .then(function() {
        $location.path('/admin/questions');
      })
      .catch(function(response) {
        vm.error = response.data;
      });
    }
  }

})();

