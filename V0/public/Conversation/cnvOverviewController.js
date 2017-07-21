app.controller('cnvOverviewController',
 ['$scope', '$state', '$http', '$uibModal', 'notifyDlg', 'login', 'cnvs',
 function($scope, $state, $http, $uibM, nDlg, login, cnvs) {
   $scope.cnvs = cnvs;
   $scope.user = login.getUser();

   $http.get('/Prss', {params: {email: $scope.user.email}})
    .then(function(rsp) {
      $scope.user.id = rsp.data[0].id;
   });

   $scope.newCnv = function() {
      $scope.title = null;
      $scope.dlgTitle = "New Conversation";
      var selectedTitle;

      $uibM.open({
         templateUrl: 'Conversation/editCnvDlg.template.html',
         scope: $scope
      }).result
      .then(function(newTitle) {
         selectedTitle = newTitle;
         return $http.post("Cnvs", {title: newTitle});
      })
      .then(function() {
         if ($state.current.name === "cnvOverview")
            return $http.get('/Cnvs');
         else
            return $http.get('/Cnvs', {params: {owner: $state.params.ownerId}});
      })
      .then(function(rsp) {
         $scope.cnvs = rsp.data;
      })
      .catch(function(err) {
         if (err && err.data[0].tag == "dupTitle")
            nDlg.show($scope, "Another conversation already has title \"" +
             selectedTitle + "\"", "Error");
      });
   };

   $scope.editCnv = function(cnvId) {
      $scope.dlgTitle = "Edit Conversation";
      var selectedTitle;
      var id = cnvId;
      $uibM.open({
         templateUrl: 'Conversation/editCnvDlg.template.html',
         scope: $scope
      }).result
      .then(function(newTitle) {
         selectedTitle = newTitle;
         return $http.put("Cnvs/" + id, {title: newTitle});
      })
      .then(function() {
         if ($state.current.name === "cnvOverview")
            return $http.get('/Cnvs');
         else
            return $http.get('/Cnvs', {params: {owner: $state.params.ownerId}});
      })
      .then(function(rsp) {
         $scope.cnvs = rsp.data;
      })
      .catch(function(err) {
         if (err && err.data[0].tag == "dupTitle")
            nDlg.show($scope, "Another conversation already has title \"" +
             selectedTitle + "\"", "Error");
      });
   };

   $scope.delCnv = function(cnvId) {
      $scope.dlgTitle = "Delete Conversation";
      var id = cnvId;
      $uibM.open({
         templateUrl: 'Conversation/delCnvDlg.template.html',
         scope: $scope
      }).result
      .then(function() {
         return $http.delete("Cnvs/" + id);
      })
      .then(function() {
         if ($state.current.name === "cnvOverview")
            return $http.get('/Cnvs');
         else
            return $http.get('/Cnvs', {params: {owner: $state.params.ownerId}});
      })
      .then(function(rsp) {
         $scope.cnvs = rsp.data;
      })
      .catch(function(err) {
         if (err)
            nDlg.show($scope, "Could not delete conversation " + cnvId);
      });
   };
}]);
