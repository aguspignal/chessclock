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
