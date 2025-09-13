import { initReactI18next } from "react-i18next"
import i18next from "i18next"
import translationBG from "./src/locales/bg/translation.json"
import translationDE from "./src/locales/de/translation.json"
import translationEN from "./src/locales/en/translation.json"
import translationES from "./src/locales/es/translation.json"
import translationFR from "./src/locales/fr/translation.json"
import translationIT from "./src/locales/it/translation.json"
import translationPT from "./src/locales/pt/translation.json"
import translationSR from "./src/locales/sr/translation.json"

i18next.use(initReactI18next).init({
	resources: {
		bg: { translation: translationBG },
		de: { translation: translationDE },
		en: { translation: translationEN },
		es: { translation: translationES },
		fr: { translation: translationFR },
		it: { translation: translationIT },
		pt: { translation: translationPT },
		sr: { translation: translationSR },
	},
	fallbackLng: "en",
	debug: true,
	interpolation: {
		escapeValue: false,
	},
})

export default i18next
