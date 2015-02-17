'use strict';

describe('Controller: DialogController', function () {

  // load the controller's module
  beforeEach(module('CassandraWorkbenchApp'));

  var DialogController, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DialogController = $controller('DialogController', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
