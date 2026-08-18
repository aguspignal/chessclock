import translation from "../locales/en/translation.json"

export const resources = {
	translation,
} as const

export enum AppLanguage {
	ar = "ar",
	bg = "bg",
	bn = "bn",
	cs = "cs",
	da = "da",
	de = "de",
	el = "el",
	en = "en",
	en_GB = "en-GB",
	es = "es",
	et = "et",
	fr = "fr",
	he = "he",
	hi = "hi",
	hr = "hr",
	hu = "hu",
	hy = "hy",
	id = "id",
	it = "it",
	ja = "ja",
	ko = "ko",
	nl = "nl",
	pl = "pl",
	pt_BR = "pt-BR",
	pt_PT = "pt-PT",
	ro = "ro",
	ru = "ru",
	sq = "sq",
	sr = "sr",
	th = "th",
	tl = "tl",
	tr = "tr",
	uk = "uk",
	vi = "vi",
	zh = "zh",
	zh_TW = "zh-TW",
}

export const LANGUAGES_CODES = Object.values(AppLanguage)

const LANGUAGES = [
	{ code: AppLanguage.ar, name: "العربية" },
	{ code: AppLanguage.bg, name: "български" },
	{ code: AppLanguage.bn, name: "বাংলা" },
	{ code: AppLanguage.cs, name: "čeština" },
	{ code: AppLanguage.da, name: "Dansk" },
	{ code: AppLanguage.de, name: "Deutsch" },
	{ code: AppLanguage.el, name: "Ελληνικά" },
	{ code: AppLanguage.en, name: "English" },
	{ code: AppLanguage.en_GB, name: "English (UK)" },
	{ code: AppLanguage.es, name: "Español" },
	{ code: AppLanguage.et, name: "Eesti" },
	{ code: AppLanguage.fr, name: "Français" },
	{ code: AppLanguage.he, name: "עברית" },
	{ code: AppLanguage.hi, name: "हिन्दी" },
	{ code: AppLanguage.hr, name: "Hrvatski" },
	{ code: AppLanguage.hu, name: "Magyar" },
	{ code: AppLanguage.hy, name: "Հայերեն" },
	{ code: AppLanguage.id, name: "Bahasa Indonesia" },
	{ code: AppLanguage.it, name: "Italiano" },
	{ code: AppLanguage.ja, name: "日本語" },
	{ code: AppLanguage.ko, name: "한국어" },
	{ code: AppLanguage.nl, name: "Nederlands" },
	{ code: AppLanguage.pl, name: "Polski" },
	{ code: AppLanguage.pt_BR, name: "Português do Brasil " },
	{ code: AppLanguage.pt_PT, name: "Português europeu" },
	{ code: AppLanguage.ro, name: "Română" },
	{ code: AppLanguage.ru, name: "Русский" },
	{ code: AppLanguage.sq, name: "Shqip" },
	{ code: AppLanguage.sr, name: "Српски" },
	{ code: AppLanguage.th, name: "ไทย" },
	{ code: AppLanguage.tl, name: "Filipino" },
	{ code: AppLanguage.tr, name: "Türkçe" },
	{ code: AppLanguage.uk, name: "Українська" },
	{ code: AppLanguage.vi, name: "Tiếng Việt" },
	{ code: AppLanguage.zh, name: "中文" }, // Simplified
	{ code: AppLanguage.zh_TW, name: "繁體中文" }, // Traditional
]

export const LANGUAGES_MAP = Object.fromEntries(
	LANGUAGES.map((lang) => [lang.code, lang]),
) as Record<AppLanguage, typeof LANGUAGES[number]>

type Underscored<T extends string> = T extends `${infer A}-${infer B}`
	? `${A}_${Underscored<B>}`
	: T

// The i18next spelling of every `AppLanguage`. `i18n.ts` types its `resources` map as a
// full record of this, so a locale added to the enum but never wired into i18next is a
// typecheck failure instead of a language that silently falls back at runtime.
export type I18nLanguage = Underscored<`${AppLanguage}`>

// i18next resource keys use underscores while `AppLanguage` uses hyphens, so every
// `changeLanguage` call has to convert on the way in. Centralised here so a new call site
// cannot forget it.
export function toI18nLanguage(code: AppLanguage): I18nLanguage {
	return code.replace("-", "_") as I18nLanguage
}

// The reverse: an active i18next language has to be mapped back before it can be matched
// against an option.
// Anything unrecognised — a device locale with no bundle, for instance — falls back to
// the same language i18next itself falls back to.
export function toAppLanguage(lng: string | undefined): AppLanguage {
	const code = (lng ?? "").replace("_", "-")

	return LANGUAGES_CODES.includes(code as AppLanguage) ? (code as AppLanguage) : AppLanguage.en
}
