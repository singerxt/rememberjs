'use strict';

var testCtrl = function($scope, helper) {
	$scope.testVar = 'AngularJS is working...';
	helper.getVersion();
};

module.exports = testCtrl;
