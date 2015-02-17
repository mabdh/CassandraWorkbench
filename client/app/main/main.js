'use strict';

(function(){
   var app = angular.module('CassandraWorkbenchApp');

   app.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main'
      });
  });
})();
