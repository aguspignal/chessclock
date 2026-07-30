import { AppLanguage, LANGUAGES_CODES, LANGUAGES_MAP } from "../types/languages"
import { AppTheme } from "../types/utils"
import { Dropdown } from "react-native-element-dropdown"
import { SHOW_THEME_SETTING } from "../utils/constants"
import { StyleSheet, View } from "react-native"
import { theme } from "../resources/theme"
import { useConfigStore } from "../stores/useConfigStore"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import Card, { CardDivider } from "../components/Card"
import ConfirmationModal from "../components/ConfirmationModal"
import PresetRow from "../components/PresetRow"
import SegmentedControl from "../components/SegmentedControl"
import SettingRow from "../components/SettingRow"
import SettingSwitch from "../components/SettingSwitch"
import useDatabase from "../hooks/useDatabase"

export default function Settings() {
	const { t, i18n } = useTranslation()
	const {
		language,
		setLanguage,
		soundEnabled,
		toggleSoundEnabled,
		vibrationEnabled,
		toggleVibrationEnabled,
		appTheme,
		setAppTheme,
	} = useConfigStore()
	const { restoreDefaultPresets } = useDatabase()
	const [selectedLng, setSelectedLng] = useState<AppLanguage | null>(language ?? AppLanguage.en)
	const [restoreModalVisible, setRestoreModalVisible] = useState<boolean>(false)
	const [presetsRestored, setPresetsRestored] = useState<boolean>(false)

	async function handleRestoreDefaultPresets() {
		try {
			await restoreDefaultPresets()
		} catch (e) {
			// Leave the modal open so the restore can be retried.
			console.log("Something went wrong restoring the default presets", e)
			return
		}

		setPresetsRestored(true)
		setRestoreModalVisible(false)
	}

	useEffect(() => {
		if (selectedLng) {
			i18n.changeLanguage(selectedLng.replace("-", "_"), (err) => {
				if (err) console.log(err)
			})
			setLanguage(selectedLng)
		}
	}, [selectedLng])

	return (
		<View style={styles.container}>
			<Card>
				<SettingRow icon="translate" label={t("configs.language")}>
					<Dropdown
						style={styles.dropdown}
						selectedTextStyle={styles.dropdownText}
						containerStyle={styles.dropdownList}
						itemTextStyle={styles.dropdownItemText}
						itemContainerStyle={styles.dropdownItem}
						activeColor={theme.colors.surfaceActive}
						labelField="label"
						valueField="value"
						value={selectedLng ?? ""}
						data={LANGUAGES_CODES.map((langCode) => ({
							label: LANGUAGES_MAP[langCode].name,
							value: langCode,
						}))}
						onChange={(i) => setSelectedLng(i.value)}
						renderRightIcon={() => <></>}
					/>
				</SettingRow>

				<CardDivider />

				<SettingRow
					icon={soundEnabled ? "volume-high" : "volume-off"}
					label={t("configs.sound")}
				>
					<SettingSwitch value={soundEnabled} onValueChange={toggleSoundEnabled} />
				</SettingRow>

				<CardDivider />

				<SettingRow
					icon={vibrationEnabled ? "vibrate" : "vibrate-off"}
					label={t("configs.vibration")}
				>
					<SettingSwitch
						value={vibrationEnabled}
						onValueChange={toggleVibrationEnabled}
					/>
				</SettingRow>

				{SHOW_THEME_SETTING && (
					<>
						<CardDivider />

						<SettingRow icon="theme-light-dark" label={t("configs.theme")}>
							<SegmentedControl
								options={[
									{ value: "System", icon: "cellphone" },
									{ value: "Light", icon: "white-balance-sunny" },
									{ value: "Dark", icon: "weather-night" },
								]}
								selected={appTheme}
								onSelect={(value) => setAppTheme(value as AppTheme)}
							/>
						</SettingRow>
					</>
				)}
			</Card>

			<Card style={styles.actionsCard}>
				<PresetRow
					label={t("restore-default-presets")}
					icon="restore"
					onPress={() => setRestoreModalVisible(true)}
					trailingIcon={presetsRestored ? "check" : "chevron-right"}
					trailingIconColor={
						presetsRestored ? theme.colors.green : theme.colors.grayDark
					}
				/>
			</Card>

			<ConfirmationModal
				isVisible={restoreModalVisible}
				setIsVisible={setRestoreModalVisible}
				title={t("confirm-presets-restore")}
				saveActionTitle={t("actions.confirm")}
				onSave={handleRestoreDefaultPresets}
				isDestructive={false}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: theme.colors.backgroundDark,
		flex: 1,
		paddingTop: theme.spacing.s,
	},
	actionsCard: {
		marginTop: theme.spacing.s,
	},
	dropdown: {
		flex: 1,
	},
	dropdownText: {
		color: theme.colors.grayDark,
		fontSize: theme.fontSize.s,
		textAlign: "right",
	},
	dropdownList: {
		backgroundColor: theme.colors.surface,
		borderColor: theme.colors.border,
		borderRadius: theme.spacing.xs,
		borderWidth: 1,
	},
	dropdownItem: {
		borderRadius: theme.spacing.xs,
	},
	dropdownItemText: {
		color: theme.colors.textLight,
		fontSize: theme.fontSize.s,
	},
})
