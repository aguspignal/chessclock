import { StatusBar } from "expo-status-bar"
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
		const lng = language ? language.replace("-", "_") : RNLocalize.getLocales()[0].languageCode

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
