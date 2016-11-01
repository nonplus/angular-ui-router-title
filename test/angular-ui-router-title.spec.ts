let mock = angular.mock;

describe('on $stateChangeSuccess', function() {

	beforeEach(mock.module('ui.router.title'));

	describe("when no $title", function() {

		beforeEach(mock.module(function($stateProvider: ng.ui.IStateProvider) {

			$stateProvider
				.state('parent', {
				})
				.state('parent.child', {
				})
			;

		}));

		it("should delete $rootScope.$title", mock.inject(function(
			$state: ng.ui.IStateService,
			$rootScope: ng.IRootScopeService,
			$timeout: ng.ITimeoutService
		) {
			$rootScope.$title = 'originalTitle';

			$state.go('parent');
			$timeout.flush(); $rootScope.$digest();
			expect($rootScope.$title).toEqual(undefined);

			$rootScope.$title = 'originalTitle';
			$state.go('parent.child');
			$timeout.flush(); $rootScope.$digest();
			expect($rootScope.$title).toEqual(undefined);
		}));

		it("should set $rootScope.$breadCrumbs to []", mock.inject(function(
			$state: ng.ui.IStateService,
			$rootScope: ng.IRootScopeService,
			$timeout: ng.ITimeoutService
		) {
			$rootScope.$breadcrumbs = [{ title: "title", state: "state", stateParams: null }];

			$state.go('parent');
			$timeout.flush(); $rootScope.$digest();
			expect($rootScope.$breadcrumbs).toEqual([]);

			$rootScope.$breadcrumbs = [{ title: "title", state: "state", stateParams: null }];

			$state.go('parent.child');
			$timeout.flush(); $rootScope.$digest();
			expect($rootScope.$breadcrumbs).toEqual([]);
		}));

	}); // when no $title

	describe("when $title is a function", function() {

		var parentTitle, grandChildTitle;

		beforeEach(mock.module(function($stateProvider: ng.ui.IStateProvider) {

			$stateProvider
				.state('parent', {
					params: {
						param1: null
					},
					resolve: {
						$title: function() {
							return function() {
								return parentTitle;
							};
						}
					}
				})
				.state('parent.child', {
				})
				.state('parent.child.grandchild', {
					params: {
						param2: null
					},
					resolve: {
						$title: function() {
							return function() {
								return grandChildTitle;
							};
						}
					}
				})
			;

		}));

		it("should set $rootScope.$title", mock.inject(function(
			$state: ng.ui.IStateService,
			$rootScope: ng.IRootScopeService,
			$timeout: ng.ITimeoutService
		) {
			$rootScope.$title = 'originalTitle';

			parentTitle = 'parent-title 1';
			$state.go('parent');
			$timeout.flush(); $rootScope.$digest();
			expect($rootScope.$title).toEqual('parent-title 1');

			parentTitle = 'parent-title 2';
			$state.go('parent.child');
			$timeout.flush(); $rootScope.$digest();
			$state.go('parent');
			$timeout.flush(); $rootScope.$digest();
			expect($rootScope.$title).toEqual('parent-title 2');

			parentTitle = 'parent-title 3';
			$state.go('parent.child');
			$timeout.flush(); $rootScope.$digest();
			expect($rootScope.$title).toEqual('parent-title 3');

			grandChildTitle = 'grandchild-title 1';
			$state.go('parent.child.grandchild', { param1: "param1" });
			$timeout.flush(); $rootScope.$digest();
			expect($rootScope.$title).toEqual('grandchild-title 1');
		}));

		it("should set $rootScope.$breadcrumbs", mock.inject(function(
			$state: ng.ui.IStateService,
			$rootScope: ng.IRootScopeService,
			$timeout: ng.ITimeoutService
		) {
			$rootScope.$breadcrumbs = [{ title: "title", state: "state", stateParams: null }];

			parentTitle = 'parent-title 1';
			$state.go('parent');
			$timeout.flush(); $rootScope.$digest();
			expect($rootScope.$breadcrumbs).toEqual([{
				title: 'parent-title 1',
				state: 'parent',
				stateParams: { param1: null }
			}]);

			parentTitle = 'parent-title 2';
			$state.go('parent.child');
			$timeout.flush(); $rootScope.$digest();
			$state.go('parent');
			$timeout.flush(); $rootScope.$digest();
			expect($rootScope.$breadcrumbs).toEqual([{
				title: 'parent-title 2',
				state: 'parent',
				stateParams: { param1: null }
			}]);

			parentTitle = 'parent-title 3';
			$state.go('parent.child', { param1: "param1" });
			$timeout.flush(); $rootScope.$digest();
			expect($rootScope.$breadcrumbs).toEqual([{
				title: 'parent-title 3',
				state: 'parent',
				stateParams: { param1: "param1" }
			}]);

			grandChildTitle = 'grandchild-title 1';
			$state.go('parent.child.grandchild', { param1: "param1", param2: "param2" });
			$timeout.flush(); $rootScope.$digest();
			expect($rootScope.$breadcrumbs).toEqual([{
				title: 'parent-title 3',
				state: 'parent',
				stateParams: { param1: "param1" }
			}, {
				title: 'grandchild-title 1',
				state: 'parent.child.grandchild',
				stateParams: { param1: "param1", param2: "param2" }
			}]);
		}));

	}); // when $title is a function

	describe("when $title is a value", function() {

		beforeEach(mock.module(function($stateProvider: ng.ui.IStateProvider) {

			$stateProvider
				.state('parent', {
					params: {
						param1: null
					},
					resolve: {
						$title: () => 'parent-title'
					}
				})
				.state('parent.child', {
				})
				.state('parent.child.grandchild', {
					params: {
						param2: null
					},
					resolve: {
						$title: () => 'grandchild-title'
					}
				})
			;

		}));

		it("should set $rootScope.$title", mock.inject(function(
			$state: ng.ui.IStateService,
			$rootScope: ng.IRootScopeService,
			$timeout: ng.ITimeoutService
		) {
			$rootScope.$title = 'originalTitle';

			$state.go('parent');
			$timeout.flush(); $rootScope.$digest();
			expect($rootScope.$title).toEqual('parent-title');

			$state.go('parent.child');
			$timeout.flush(); $rootScope.$digest();
			expect($rootScope.$title).toEqual('parent-title');

			$state.go('parent.child.grandchild');
			$timeout.flush(); $rootScope.$digest();
			expect($rootScope.$title).toEqual('grandchild-title');
		}));

		it("should set $rootScope.$breadCrumbs", mock.inject(function(
			$state: ng.ui.IStateService,
			$rootScope: ng.IRootScopeService,
			$timeout: ng.ITimeoutService
		) {
			$rootScope.$breadcrumbs = [{ title: "title", state: "state", stateParams: null }];

			$state.go('parent', { param1: "param1" });
			$timeout.flush(); $rootScope.$digest();
			expect($rootScope.$breadcrumbs).toEqual([{
				title: 'parent-title',
				state: 'parent',
				stateParams: { param1: "param1" }
			}]);

			$state.go('parent.child', { param1: "param1" });
			$timeout.flush(); $rootScope.$digest();
			expect($rootScope.$breadcrumbs).toEqual([{
				title: 'parent-title',
				state: 'parent',
				stateParams: { param1: "param1" }
			}]);

			$state.go('parent.child.grandchild', { param1: "param1", param2: "param2" });
			$timeout.flush(); $rootScope.$digest();
			expect($rootScope.$title).toEqual('grandchild-title');
			expect($rootScope.$breadcrumbs).toEqual([{
				title: 'parent-title',
				state: 'parent',
				stateParams: { param1: "param1" }
			}, {
				title: 'grandchild-title',
				state: 'parent.child.grandchild',
				stateParams: { param1: "param1", param2: "param2" }
			}]);
		}));

	}); // when $title is a value

	describe("when documentTitle configured", function() {

		function documentTitle(title) {
			return title + " Document Title";
		}

		beforeEach(mock.module(function($stateProvider: ng.ui.IStateProvider, $titleProvider: ng.ui.ITitleProvider) {

			$stateProvider
				.state('parent', {
					params: {
						param1: null
					},
					resolve: {
						$title: () => 'parent-title'
					}
				})
				.state('parent.child', {
				})
				.state('parent.child.grandchild', {
					params: {
						param2: null
					},
					resolve: {
						$title: () => 'grandchild-title'
					}
				})
			;

			$titleProvider.documentTitle(function ($rootScope) {
				return documentTitle($rootScope.$title);
			});

		}));

		it("should set document.title and <title> to documentTitle($title)", mock.inject(function(
			$state: ng.ui.IStateService,
			$rootScope: ng.IRootScopeService,
			$timeout: ng.ITimeoutService
		) {
			$rootScope.$breadcrumbs = [{ title: "title", state: "state", stateParams: null }];
			for (let eltTitle of [].slice.call(document.getElementsByTagName("title"))) {
				eltTitle.parentElement.removeChild(eltTitle);
			}
			document.title = "Initial Title";

			$state.go('parent', { param1: "param1" });
			$timeout.flush(); $rootScope.$digest();
			assertTitle('parent-title');

			$state.go('parent.child', { param1: "param1" });
			$timeout.flush(); $rootScope.$digest();
			assertTitle('parent-title');

			$state.go('parent.child.grandchild', { param1: "param1", param2: "param2" });
			$timeout.flush(); $rootScope.$digest();
			assertTitle('grandchild-title');
		}));

		function assertTitle($title) {
			let expecte = documentTitle($title);
			expect(document.title).toEqual(expecte);
			expect((document.getElementsByTagName("title")[0] as HTMLTitleElement).text).toEqual(expecte);
		}

	}); // when documentTitle configured

	describe("when documentTitle not configured", function() {

		beforeEach(mock.module(function($stateProvider: ng.ui.IStateProvider, $titleProvider: ng.ui.ITitleProvider) {

			$stateProvider
				.state('parent', {
					params: {
						param1: null
					},
					resolve: {
						$title: () => 'parent-title'
					}
				})
				.state('parent.child', {
				})
				.state('parent.child.grandchild', {
					params: {
						param2: null
					},
					resolve: {
						$title: () => 'grandchild-title'
					}
				})
			;

			$titleProvider.documentTitle(null);

		}));

		it("should set document.title and <title> to $title", mock.inject(function(
			$state: ng.ui.IStateService,
			$rootScope: ng.IRootScopeService,
			$timeout: ng.ITimeoutService
		) {
			$rootScope.$breadcrumbs = [{ title: "title", state: "state", stateParams: null }];
			for (let eltTitle of [].slice.call(document.getElementsByTagName("title"))) {
				eltTitle.parentElement.removeChild(eltTitle);
			}
			document.title = "Initial Title";

			$state.go('parent', { param1: "param1" });
			$timeout.flush(); $rootScope.$digest();
			assertTitle('parent-title');

			$state.go('parent.child', { param1: "param1" });
			$timeout.flush(); $rootScope.$digest();
			assertTitle('parent-title');

			$state.go('parent.child.grandchild', { param1: "param1", param2: "param2" });
			$timeout.flush(); $rootScope.$digest();
			assertTitle('grandchild-title');
		}));

		function assertTitle($title) {
			let expected = $title;
			expect(document.title).toEqual(expected);
			expect((document.getElementsByTagName("title")[0] as HTMLTitleElement).text).toEqual(expected);
		}

	}); // when documentTitle not configured

}); // on $stateChangeSuccess