describe('on $stateChangeSuccess', function() {

	var $stateProvider;

	beforeEach(module('ui.router.title'));

	beforeEach(module('ui.router', function (_$stateProvider_) {
		$stateProvider = _$stateProvider_;
	}));

	describe("when no $title", function() {

		beforeEach(module(function($stateProvider) {

			$stateProvider
				.state('parent', {
				})
				.state('parent.child', {
				})
			;

		}));

		it("should delete $rootScope.$title", inject(function($state, $rootScope, $timeout) {
			$rootScope.$title = 'originalTitle';

			$state.go('parent');
			$timeout.flush(); $rootScope.$digest();
			expect($rootScope.$title).toEqual(undefined);

			$rootScope.$title = 'originalTitle';
			$state.go('parent.child');
			$timeout.flush(); $rootScope.$digest();
			expect($rootScope.$title).toEqual(undefined);
		}));

	}); // when no $title

	describe("when $title is a function", function() {

		var parentTitle, grandChildTitle;

		beforeEach(module(function($stateProvider) {

			$stateProvider
				.state('parent', {
					resolve: {
						$title: function() {
							return function() {
								return parentTitle;
							}
						}
					}
				})
				.state('parent.child', {
				})
				.state('parent.child.grandchild', {
					resolve: {
						$title: function() {
							return function() {
								return grandChildTitle;
							}
						}
					}
				})
			;

		}));

		it("should not set $rootScope.$title", inject(function($state, $rootScope, $timeout) {
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
			$state.go('parent.child.grandchild');
			$timeout.flush(); $rootScope.$digest();
			expect($rootScope.$title).toEqual('grandchild-title 1');
		}));

	}); // when $title is a function

	describe("when $title is a value", function() {

		beforeEach(module(function($stateProvider) {

			$stateProvider
				.state('parent', {
					resolve: {
						$title: _.constant('parent-title')
					}
				})
				.state('parent.child', {
				})
				.state('parent.child.grandchild', {
					resolve: {
						$title: _.constant('grandchild-title')
					}
				})
			;

		}));

		it("should not set $rootScope.$title", inject(function($state, $rootScope, $timeout) {
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

	}); // when $title is a value

}); // on $stateChangeSuccess