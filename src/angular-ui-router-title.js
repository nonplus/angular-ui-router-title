"use strict";
angular.module("ui.router.title", ["ui.router"])
	.run(["$rootScope", "$timeout", "$state", function($rootScope, $timeout, $state) {

		$rootScope.$on("$stateChangeSuccess", function() {
			var title = $state.$current.locals.globals.$title;
			if(angular.isFunction(title)) {
				title = title();
			}
			if(title) {
				$timeout(function() {
					$rootScope.$title = title;
				});
			}
		});

	}]);
