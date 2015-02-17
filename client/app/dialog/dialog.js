'use strict';

(function(){
    var app = angular.module('CassandraWorkbenchApp');
    
    app.config(function ($routeProvider) {
        $routeProvider
          .when('/dialog', {
            templateUrl: 'app/dialog/dialog.html',
            controller: 'DialogController'
            //controllerAs: 'dialog'
          });
    });
    
})();
