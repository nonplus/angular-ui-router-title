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

	namespace ui {
		interface ITitleService {
			title: () => string;
			breadCrumbs: () => {
				title: string;
				state: string;
				stateParams: { ["key"]: any }
			}[];
		}

		interface ITitleProvider {
			documentTitle(inlineAnnotatedFunction: (string | ((...args: any[]) => string))[]): void;
			documentTitle(func: ((...args: any[]) => string) & Function): void;
		}
	}
}
