import {
	orderPresetsByDuration,
	parsePresetToDatabasePreset,
	parseStringToNumber,
	parseTimeToPresetName,
} from "../utils/parsing"
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native"
import { Preset } from "../types/utils"
import { PresetsProps } from "../types/navigation"
import { theme } from "../resources/theme"
import { useEffect, useState } from "react"
import { useSecondTimeStore, useTimeStore } from "../stores/useTimeStore"
import { useTranslation } from "react-i18next"
import ActionButton from "../components/ActionButton"
import Card, { CardDivider } from "../components/Card"
import ConfirmationModal from "../components/ConfirmationModal"
import Icon from "@expo/vector-icons/MaterialCommunityIcons"
import PresetRow from "../components/PresetRow"
import TimeInputModal from "../components/TimeInputModal"
import useDatabase from "../hooks/useDatabase"

export default function Presets({ navigation, route }: PresetsProps) {
	const { t } = useTranslation()
	const { getAllPresets, postPreset, deletePreset } = useDatabase()
	const { setTime } = useTimeStore()
	const { setSecondTime } = useSecondTimeStore()

	const target = route.params?.target ?? "both"

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
		if (target !== "second") setTime(preset)
		if (target !== "primary") setSecondTime(preset)
		navigation.popToTop()
	}

	async function refreshFlatlist() {
		try {
			const presets = await getAllPresets()
			setFlatlistData(orderPresetsByDuration(presets))
		} catch (e) {
			console.log("Something went wrong loading the presets", e)
		}
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
			timeIncrementMs: parseStringToNumber(timeIncrement) * 1000,
		}

		try {
			await postPreset(parsePresetToDatabasePreset(newPreset))
		} catch (e) {
			// Leave the modal open with the typed values so the save can be retried.
			console.log("Something went wrong saving the preset", e)
			return
		}

		await refreshFlatlist()
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
		if (selectedItem?.id === undefined) return

		try {
			await deletePreset(selectedItem.id)
		} catch (e) {
			console.log("Something went wrong deleting the preset", e)
			return
		}

		await refreshFlatlist()
		setConfirmationModalVisible(false)
	}

	useEffect(() => {
		refreshFlatlist()
	}, [])

	return (
		<View style={styles.container}>
			<View style={styles.actionsContainer}>
				{isEditing ? (
					<View />
				) : (
					<Pressable onPress={() => setTimeModalVisible(true)} style={styles.addBtn}>
						<Icon name="plus" size={theme.fontSize.xxl} color={theme.colors.textDark} />
						<Text style={styles.addBtnText}>{t("add-preset")}</Text>
					</Pressable>
				)}

				<ActionButton
					icon={isEditing ? "window-close" : "pencil"}
					onPress={() => setIsEditing(!isEditing)}
				/>
			</View>

			<Card style={styles.listCard}>
				<FlatList
					data={flatlistData}
					keyExtractor={(item) => String(item.id)}
					ItemSeparatorComponent={CardDivider}
					renderItem={({ item }) => (
						<PresetRow
							label={item.name}
							onPress={() => handlePressItem(item)}
							trailingIcon={isEditing ? "delete" : "chevron-right"}
							trailingIconColor={isEditing ? theme.colors.red : theme.colors.grayDark}
						/>
					)}
				/>
			</Card>

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
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "space-between",
		marginHorizontal: theme.spacing.s,
		marginVertical: theme.spacing.xs,
	},
	addBtn: {
		alignItems: "center",
		backgroundColor: theme.colors.accent,
		borderRadius: theme.spacing.xs,
		flexDirection: "row",
		gap: 4,
		paddingHorizontal: theme.spacing.xs,
		paddingVertical: theme.spacing.xxs,
	},
	addBtnText: {
		color: theme.colors.textDark,
		fontSize: theme.fontSize.s,
		fontWeight: "600",
	},
	listCard: {
		flex: 1,
		marginBottom: theme.spacing.s,
		overflow: "hidden",
	},
})
