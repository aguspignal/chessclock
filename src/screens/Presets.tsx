import {
	orderPresetsByDuration,
	parsePresetToDatabasePreset,
	parseStringToNumber,
	parseTimeToPresetName,
} from "../utils/parsing"
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native"
import { Preset } from "../types/utils"
import { PresetsProps } from "../types/navigation"
import { theme } from "../resources/theme"
import { useEffect, useState } from "react"
import { useSecondTimeStore, useTimeStore } from "../stores/useTimeStore"
import { useTranslation } from "react-i18next"
import ConfigBox from "../components/ConfigBox"
import ConfirmationModal from "../components/ConfirmationModal"
import IconButton from "../components/IconButton"
import TimeInputModal from "../components/TimeInputModal"
import useDatabase from "../hooks/useDatabase"

export default function Presets({ navigation }: PresetsProps) {
	const { t } = useTranslation()
	const { getAllPresets, postPreset, deletePreset } = useDatabase()
	const { setTime } = useTimeStore()
	const { setSecondTime } = useSecondTimeStore()

	const [isEditing, setIsEditing] = useState<boolean>(false)
	const [flatlistData, setFlatlistData] = useState<Preset[]>([])
	const [selectedItem, setSelectedItem] = useState<Preset | null>(null)
	const [confirmationModalVisible, setConfirmationModalVisible] = useState<boolean>(false)

	const [timeModalVisible, setTimeModalVisible] = useState<boolean>(false)
	const [hours, setHours] = useState<string>("")
	const [minutes, setMinutes] = useState<string>("")
	const [seconds, setSeconds] = useState<string>("")
	const [timeIncrement, setTimeIncrement] = useState<string>("")

	function handleSelectPreset(preset: Preset) {
		setTime(preset)
		setSecondTime(preset)
		navigation.popToTop()
	}

	async function refreshFlatlist() {
		const presets = await getAllPresets()
		setFlatlistData(orderPresetsByDuration(presets))
	}

	async function handleSaveTimeModal() {
		const presetName = parseTimeToPresetName(hours, minutes, seconds, timeIncrement)
		if (presetName === "") return

		const newPreset: Preset = {
			name: presetName,
			time: {
				hours: parseStringToNumber(hours),
				minutes: parseStringToNumber(minutes),
				seconds: parseStringToNumber(seconds),
			},
			timeIncrement: parseStringToNumber(timeIncrement),
		}

		await postPreset(parsePresetToDatabasePreset(newPreset))
		refreshFlatlist()
		setTimeModalVisible(false)
	}

	function handlePressItem(item: Preset) {
		if (isEditing) {
			setConfirmationModalVisible(true)
			setSelectedItem(item)
		} else {
			handleSelectPreset(item)
		}
	}

	async function handleConfirmDeletion() {
		if (!selectedItem) return

		await deletePreset(selectedItem)
		refreshFlatlist()
		setConfirmationModalVisible(false)
	}

	useEffect(() => {
		refreshFlatlist()
	}, [])

	return (
		<View style={styles.container}>
			<View style={styles.actionsContainer}>
				{isEditing ? (
					<View></View>
				) : (
					<IconButton
						onPress={() => setTimeModalVisible(true)}
						iconName="plus"
						title={t("add-preset")}
					/>
				)}

				<IconButton
					onPress={() => setIsEditing(!isEditing)}
					iconName={isEditing ? "window-close" : "pencil"}
				/>
			</View>

			<View style={styles.flatlistContainer}>
				<FlatList
					data={flatlistData}
					keyExtractor={(item) => item.name}
					renderItem={({ item }) => {
						return (
							<TouchableOpacity
								onPress={() => handlePressItem(item)}
								style={styles.flatlistItemContainer}
								activeOpacity={0.75}
							>
								<ConfigBox
									title={item.name}
									isIcon
									valueName={isEditing ? "delete" : "chevron-right"}
								/>
							</TouchableOpacity>
						)
					}}
				/>
			</View>

			<TimeInputModal
				isVisible={timeModalVisible}
				setIsVisible={setTimeModalVisible}
				title={t("new-preset-title")}
				saveActionTitle={t("actions.confirm")}
				onSave={handleSaveTimeModal}
				hours={hours}
				setHours={setHours}
				minutes={minutes}
				setMinutes={setMinutes}
				seconds={seconds}
				setSeconds={setSeconds}
				withIncrementInput
				increment={timeIncrement}
				setIncrement={setTimeIncrement}
			/>

			<ConfirmationModal
				isVisible={confirmationModalVisible}
				setIsVisible={setConfirmationModalVisible}
				title={t("confirm-preset-deletion")}
				saveActionTitle={t("actions.delete")}
				onSave={handleConfirmDeletion}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: theme.colors.backgroundDark,
		flex: 1,
	},
	actionsContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginVertical: theme.spacing.xs,
		paddingLeft: theme.spacing.s,
		paddingRight: theme.spacing.m,
	},
	timeModalContainer: {
		alignItems: "center",
		alignSelf: "center",
		backgroundColor: theme.colors.backgroundDark,
		borderRadius: 16,
		justifyContent: "center",
		paddingHorizontal: theme.spacing.l,
		paddingVertical: theme.spacing.m,
	},
	timeModalText: {
		color: theme.colors.textLight,
		fontSize: theme.fontSize.m,
		fontWeight: "500",
	},
	timeModalInputsContainer: {
		alignItems: "center",
		flexDirection: "row",
	},
	timeModalInputContainer: {
		backgroundColor: theme.colors.grayLight,
		borderRadius: 8,
		marginTop: theme.spacing.l,
		paddingVertical: theme.spacing.xxs,
	},
	timeModalInput: {
		fontSize: theme.fontSize.xl,
		fontWeight: "500",
		paddingHorizontal: theme.spacing.s,
	},
	timeModalColon: {
		color: theme.colors.grayLight,
		fontSize: theme.fontSize.xl,
		fontWeight: "500",
		marginHorizontal: 4,
	},
	timeModalActionsContainer: {
		alignSelf: "flex-end",
		borderRadius: 8,
		flexDirection: "row",
	},
	configContainer: {
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "center",
		marginVertical: theme.spacing.l,
		paddingHorizontal: theme.spacing.s,
	},
	configText: {
		color: theme.colors.textLight,
		fontSize: theme.fontSize.m,
		fontWeight: "500",
	},
	timeIncrementInput: {
		borderBottomColor: theme.colors.textLight,
		borderBottomWidth: 2,
		color: theme.colors.textLight,
		fontSize: theme.fontSize.l,
		fontWeight: "500",
		marginLeft: theme.spacing.xxs,
		paddingHorizontal: theme.spacing.xxs,
	},
	flatlistContainer: {
		flex: 1,
	},
	flatlistItemContainer: {
		padding: theme.spacing.xxs,
	},
})
