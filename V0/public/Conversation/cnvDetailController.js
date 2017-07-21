app.controller('cnvDetailController',
 ['$scope', '$state', '$http', '$uibModal', 'notifyDlg', 'login', 'msgs',
 function($scope, $state, $http, $uibM, nDlg, login, msgs) {
   $scope.msgs = msgs;
   $scope.cnvId = $state.params.cnvId;
   $scope.message = null;

   $scope.newMessage = function() {
      $http.post("Cnvs/" + $scope.cnvId + "/Msgs", {content: $scope.message})
      .then(function() {
         return $http.get('/Cnvs/' + $scope.cnvId + '/Msgs');
      })
      .then(function(rsp) {
         $scope.msgs = rsp.data;
         $scope.message = null;
      })
      .catch(function(err) {
         if (err)
            nDlg.show($scope, "Could not post your message", "Error");
      });
   };
}]);
