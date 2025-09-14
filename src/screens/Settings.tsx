import { AppLanguage, LANGUAGES_CODES, LANGUAGES_MAP } from "../types/languages"
import { StyleSheet, View } from "react-native"
import { theme } from "../resources/theme"
import { useConfigStore } from "../stores/useConfigStore"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import ConfigBox from "../components/ConfigBox"

export default function Settings() {
	const { t, i18n } = useTranslation()
	const { language, setLanguage } = useConfigStore()
	const [selectedLng, setSelectedLng] = useState<AppLanguage | null>(language ?? AppLanguage.en)

	useEffect(() => {
		if (selectedLng) {
			i18n.changeLanguage(selectedLng, (err) => {
				if (err) console.log(err)
			})
			setLanguage(selectedLng)
		}
	}, [selectedLng])

	return (
		<View style={styles.container}>
			<ConfigBox
				title={t("configs.language")}
				isDropdown
				dropdownData={LANGUAGES_CODES.map((langCode) => ({
					label: LANGUAGES_MAP[langCode].name,
					value: langCode,
				}))}
				onDropdownChange={setSelectedLng}
				dropdownDefaultValue={selectedLng}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundDark,
	},
})
