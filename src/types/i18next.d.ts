import { resources } from "./languages"

declare module "i18next" {
	interface CustomTypeOptions {
		resources: typeof resources
	}
}
