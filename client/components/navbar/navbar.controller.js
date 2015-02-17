'use strict';

(function(){
   var app = angular.module('CassandraWorkbenchApp');
   app.controller('NavbarController', function ($location) {
    this.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    this.isCollapsed = true;

    this.isActive = function(route) {
      return route === $location.path();
    };
  });

})();
