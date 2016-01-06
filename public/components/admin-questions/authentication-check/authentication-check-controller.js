'use strict';

(function() {

  angular.module('svs.adminQuestions')
  .controller('AuthenticationCheckController', AuthenticationCheckController);

  function AuthenticationCheckController($scope, $state) {
    var vm = this;
    vm.close = close;
    vm.confirm = confirm;

    return;

    function confirm() {
      localStorage.usePowersForMostlyGood = true;
      $scope.closeThisDialog();
    }

    function close() {
      $state.go('home');
      $scope.closeThisDialog();
    }
  }

})();
