'use strict';

(function(){
   var app = angular.module('CassandraWorkbenchApp', [
   'ngCookies', 
   'ngResource',
   'ngSanitize',
   'ngRoute',
   'ngDialog',
   'trNgGrid'
  ]);

  app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
  });

})();
