"use strict";

let documentTitleCallback: (title: string) => string = undefined;
let defaultDocumentTitle = document.title;

angular.module("ui.router.title", ["ui.router"])
	.provider("$title", function $titleProvider() {
		return {
			documentTitle: (cb) => {
				documentTitleCallback = cb;
			},
			$get: ["$state", ($state: ng.ui.IStateService): ng.ui.ITitleService => {
				return {
					title: () => getTitleValue($state.$current.locals.globals["$title"]),
					breadCrumbs: () => {
						let $breadcrumbs = [];
						var state = $state.$current;
						while (state) {
							if (state["resolve"] && state["resolve"].$title) {
								$breadcrumbs.unshift({
									title: getTitleValue(state.locals.globals["$title"]) as string,
									state: state["self"].name,
									stateParams: state.locals.globals["$stateParams"]
								});
							}
							state = state["parent"];
						}
						return $breadcrumbs;
					}
				};
			}]
		};
	})
	.run(["$rootScope", "$timeout", "$title", "$injector", function(
		$rootScope: ng.IRootScopeService,
		$timeout: ng.ITimeoutService,
		$title: ng.ui.ITitleService,
		$injector
	) {

		$rootScope.$on("$stateChangeSuccess", function() {
			var title = $title.title();
			$timeout(function() {
				$rootScope.$title = title;
				const documentTitle = documentTitleCallback ? $injector.invoke(documentTitleCallback) : title || defaultDocumentTitle;
				document.title = documentTitle;
			});

			$rootScope.$breadcrumbs = $title.breadCrumbs();
		});

	}]);

function getTitleValue(title) {
	return angular.isFunction(title) ? title() : title;
}
