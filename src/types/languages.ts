import translation from "../resources/locales/en/translation.json"

export const resources = {
	translation,
} as const

export enum AppLanguage {
	en = "en",
	es = "es",
}
