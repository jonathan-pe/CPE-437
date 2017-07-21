app.controller('homeController',
 ['$scope', '$http', 'login', '$state', '$stateParams',
 function($scope, $http, login, $state, $stateParams) {
   $scope.$parent.user = login.getUser();

   if($scope.$parent.user) {
      $http.get('/Prss', {params: {email: $scope.$parent.user.email}})
       .then(function(rsp) {
         $scope.$parent.user.id = rsp.data[0].id;
      });
   }
}]);
