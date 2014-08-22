'use strict';
//  just require angular as if we were in node
var angular = require('angular'),
// and any angular dependency in a similar fashion
	ngRoute = require('angular-route'),
	d3 = require('d3');

// We can use our contollers, directives, services, etc, as modules.
var testCtrl = require('./controllers/testCtrl'),
	testService = require('./services/testService'),
	testDirective = require('./directives/testDirective'),
	config = require('./config'),
	version = require('../../package.json').version;

// create and bootstrap application
angular.element(document).ready(function() {

	angular.module('app', ['ngRoute'])
	.constant('version', version)
	.config(['$routeProvider', config])
	.directive('banner', [testDirective])
	.factory('helper', ['version', testService])
	.controller('myCtrl', ['$scope', 'helper', testCtrl]); 

	angular.bootstrap(document, ['app']);
});
