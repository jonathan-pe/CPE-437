app.config(['$stateProvider', '$urlRouterProvider',
   function($stateProvider, $router) {

      $stateProvider
      .state('home',  {
         url: '/',
         templateUrl: 'Home/home.template.html',
         controller: 'homeController',
      })
      .state('login', {
         url: '/login',
         templateUrl: 'Login/login.template.html',
         controller: 'loginController',
      })
      .state('register', {
         url: '/register',
         templateUrl: 'Register/register.template.html',
         controller: 'registerController',
      })
      .state('cnvOverview', {
         url: '/cnvs',
         templateUrl: 'Conversation/cnvOverview.template.html',
         controller: 'cnvOverviewController',
         resolve: {
            cnvs: ['$q', '$http', function($q, $http) {
               return $http.get('/Cnvs')
               .then(function(response){
                  return response.data;
               });
            }]
         }
      })
      .state('userCnvOverview', {
         url: '/userCnvs/:ownerId',
         templateUrl: 'Conversation/cnvOverview.template.html',
         controller: 'cnvOverviewController',
         resolve: {
            cnvs: ['$q', '$http', '$stateParams',
             function($q, $http, $stateParams) {
               return $http.get('/Cnvs',
                {params: {owner: $stateParams.ownerId}})
                .then(function(response){
                  return response.data;
                });
            }]
         }
      })
      .state('cnvDetail', {
         url: '/cnvDetail/:cnvId',
         templateUrl: 'Conversation/cnvDetail.template.html',
         controller: 'cnvDetailController',
         resolve: {
            msgs: ['$q', '$http', '$stateParams',
             function($q, $http, $stateParams) {
               return $http.get('/Cnvs/' + $stateParams.cnvId + '/Msgs')
               .then(function(response){
                  return response.data;
               });
            }]
         }
      });
   }]);
