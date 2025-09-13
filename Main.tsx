import { StatusBar } from "expo-status-bar"
import { useConfigStore } from "./src/stores/useConfigStore"
import { useEffect } from "react"
import * as RNLocalize from "react-native-localize"
import i18next from "./i18n"
import Navigator from "./Navigator"

export default function Main() {
	const { language } = useConfigStore()

	useEffect(() => {
		const locales = RNLocalize.getLocales()
		console.log(locales)

		if (language) {
			i18next.changeLanguage(language, (err) => {
				if (err) return console.log("Something went wrong loading language", err)
			})
		} else {
			i18next.changeLanguage(locales[0].languageCode, (err) => {
				if (err) return console.log("Something went wrong loading language", err)
			})
		}
	}, [])

	return (
		<>
			<StatusBar style="light" />
			<Navigator />
		</>
	)
}
