import { initReactI18next } from "react-i18next"
import i18next from "i18next"
import translationEN from "./src/resources/locales/en/translation.json"
import translationES from "./src/resources/locales/es/translation.json"

i18next.use(initReactI18next).init({
	resources: {
		en: { translation: translationEN },
		es: { translation: translationES },
	},
	lng: "en",
	fallbackLng: "en",
	debug: true,
	interpolation: {
		escapeValue: false,
	},
})

export default i18next
