'use strict';

var testDirective = function () {
	return {
		restrict: 'E',
		template: '<div class="banner"><img src="/images/gulp.png" alt="gulp"> & <img src="/images/browserify.png" alt="browserify"></div>',
	};
};

module.exports = testDirective;
