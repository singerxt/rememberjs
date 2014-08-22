'use strict';

var config = function ($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl: 'views/main.html',
		controller: 'myCtrl'
	})
	.otherwise({
		redirectTo: '/'
	});
};

module.exports = config;
