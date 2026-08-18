import { StatusBar } from "expo-status-bar"
import { toI18nLanguage } from "./src/types/languages"
import { useConfigStore } from "./src/stores/useConfigStore"
import { useEffect, useState } from "react"
import * as RNLocalize from "react-native-localize"
import i18next from "./i18n"
import Loading from "./src/screens/Loading"
import Navigator from "./Navigator"

export default function Main() {
	const hasHydrated = useConfigStore((state) => state.hasHydrated)
	const [isLanguageReady, setIsLanguageReady] = useState(false)

	// The persisted config rehydrates asynchronously, so `language` is still null on the
	// first render. Resolving it before hydration finishes always discarded the saved
	// choice in favour of the device locale.
	useEffect(() => {
		if (!hasHydrated) return

		const { language } = useConfigStore.getState()
		const lng = language
			? toI18nLanguage(language)
			: RNLocalize.getLocales()[0].languageCode

		// No alert here, unlike the other error paths: i18next has not resolved a language
		// yet, so there is nothing to phrase the message in, and `fallbackLng` already
		// leaves the app usable in English.
		i18next.changeLanguage(lng, (err) => {
			if (err) console.log("Something went wrong loading language", err)
			setIsLanguageReady(true)
		})
	}, [hasHydrated])

	if (!isLanguageReady) return <Loading />

	return (
		<>
			<StatusBar style="light" />
			<Navigator />
		</>
	)
}
