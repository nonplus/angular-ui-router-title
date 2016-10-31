import angular = require("angular");

declare module "angular" {
	interface IRootScopeService {
		$title?: string;
		$breadcrumbs: {
			title: string;
			state: string;
			stateParams: { ["key"]: any }
		}[];
	}
}
