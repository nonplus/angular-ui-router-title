files = {
	libs: [
		'node_modules/lodash/index.js',
		'node_modules/angular/angular.js',
		'node_modules/angular-ui-router/release/angular-ui-router.js'
	],

	src: [
		'src/angular-ui-router-title.js'
	],

	test: [
		'node_modules/angular-mocks/angular-mocks.js',
		'test/*.spec.js'
	]
};

if (exports) {
	var _ = require('lodash');
	_.extend(exports, files);
}