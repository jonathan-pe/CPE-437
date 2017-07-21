var app = angular.module('mainApp', [
   'ui.router',
   'ui.bootstrap'
]);

app.controller('mainController',
 ['$scope', '$state', 'login', 'notifyDlg',
 function($scope, $state, login, nDlg){

   $scope.languages = ["English", "Spanish"];
   $scope.language = "English";

   $scope.logout = function(){
      login.logout().then(function(response) {
         $scope.user = null;
         $state.go('home');
      })
      .catch(function(error) {
         nDlg.show($scope, "Can't logout. Error: " + error, "Error");
      });
   };

   $scope.setLanguage = function(index){
      if (index === 0) {
         $scope.languages = ["English", "Spanish"];
      }
      else if (index === 1) {
         $scope.languages = ["Ingles", "Espanol"];
      }
      $scope.language = $scope.languages[index];
   };
}]);

app.constant("errMap", {
   en: {
      missingField: 'Field missing from request: ',
      badValue: 'Field has bad value: ',
      notFound: 'Entity not present in DB',
      badLogin: 'Email/password combination invalid',
      dupEmail: 'Email duplicates an existing email',
      noTerms: 'Acceptance of terms is required',
      forbiddenRole: 'Role specified is not permitted.',
      noOldPwd: 'Change of password requires an old password',
      oldPwdMismatch: 'Old password that was provided is incorrect.',
      dupTitle: 'Conversation title duplicates an existing one',
      dupEnrollment: 'Duplicate enrollment',
      forbiddenField: 'Field in body not allowed.',
      queryFailed: 'Query failed (server problem).'
   },
   es: {
      missingField: '[ES] Field missing from request: ',
      badValue: '[ES] Field has bad value: ',
      notFound: '[ES] Entity not present in DB',
      badLogin: '[ES] Email/password combination invalid',
      dupEmail: '[ES] Email duplicates an existing email',
      noTerms: '[ES] Acceptance of terms is required',
      forbiddenRole: '[ES] Role specified is not permitted.',
      noOldPwd: '[ES] Change of password requires an old password',
      oldPwdMismatch: '[ES] Old password that was provided is incorrect.',
      dupTitle: '[ES] Conversation title duplicates an existing one',
      dupEnrollment: '[ES] Duplicate enrollment',
      forbiddenField: '[ES] Field in body not allowed.',
      queryFailed: '[ES] Query failed (server problem).'
   }
});

app.filter('tagError', ['errMap', function(errMap) {
   return function(err, scope) {
      var locale = errMap.es;
      if (scope.language === "English" || scope.language === "Ingles")
         locale = errMap.en;
      return locale[err.tag] + (err.params ? (err.params.length ?
       err.params[0] : "") : "");
   };
}]);

app.directive('cnvSummary', [function() {
   return {
      restrict: 'E',
      scope: {
         cnv: "=toSummarize",
         delete: "&delete",
         edit: "&edit",
         user: "=user"
      },
      template: '<a ui-sref="cnvDetail({cnvId: cnv.id})">' +
       '{{cnv.title}} - {{cnv.lastMessage | date : "medium"}}</a>' +
       '<button type="button" class="btn btn-default btn-sm pull-right"' +
        'ng-show="user && user.id == cnv.ownerId" ' +
        'ng-click="delete({cnvId: cnv.id})">' +
          '<span class="glyphicon glyphicon-trash"></span>' +
       '</button>' +
       '<button type="button" class="btn btn-default btn-sm pull-right"' +
        'ng-show="user && user.id == cnv.ownerId" ' +
        'ng-click="edit({cnvId: cnv.id})">' +
          '<span class="glyphicon glyphicon-edit"></span>' +
       '</button>'
   };
}]);
