import translation from "../locales/en/translation.json"

export const resources = {
	translation,
} as const

export enum AppLanguage {
	bg = "bg",
	de = "de",
	en = "en",
	es = "es",
	fr = "fr",
	it = "it",
	pt = "pt",
	sr = "sr",
}

export const LANGUAGES_CODES = Object.values(AppLanguage)

export const LANGUAGES_CODES_NAMES = new Map<AppLanguage, string>([
	[AppLanguage.bg, "български"],
	[AppLanguage.de, "Deutsch"],
	[AppLanguage.en, "English"],
	[AppLanguage.es, "Spanish"],
	[AppLanguage.fr, "Français"],
	[AppLanguage.it, "Italiano"],
	[AppLanguage.pt, "Português"],
	[AppLanguage.sr, "Српски"],
])
