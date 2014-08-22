'use strict';

var testService = function(version) {
	var getVersion = function () {
		console.log('package.json version', version);
	};
	return {
		getVersion : getVersion
	};
};

module.exports = testService;
