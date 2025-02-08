import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { orderPresetsByDuration, parseTimeToPresetName } from "../utils/parsing"
import { PresetsProps } from "../types/navigation"
import { theme } from "../utils/theme"
import { useState } from "react"
import ConfigBox from "../components/ConfigBox"
import IconButton from "../components/IconButton"
import Modal from "react-native-modal"
import presets from "../resources/presets.json"
import useLocalStorage from "../hooks/useLocalStorage"

export default function Presets({ navigation }: PresetsProps) {
	const { storeInLocalStorage } = useLocalStorage()

	const [isTimeModalVisible, setIsTimeModalVisible] = useState<boolean>(false)
	const [hours, setHours] = useState<string>("")
	const [minutes, setMinutes] = useState<string>("")
	const [seconds, setSeconds] = useState<string>("")
	const [timeIncrement, setTimeIncrement] = useState<string>("")

	async function handleSelectPreset(preset: Preset) {
		storeInLocalStorage({ preset })
			.then(() => {
				navigation.reset({
					index: 0,
					routes: [{ name: "Home", params: { defaultPreset: preset } }],
				})
			})
			.catch((e) => {
				console.log(e)
				navigation.popToTop()
			})
	}

	function handleSaveModal() {
		// const presetName = parseTimeToPresetName(hours, minutes, seconds, timeIncrement)
		// if (presetName === "") return
		// const newPreset: Preset = {
		// 	name: presetName,
		// 	time: {
		// 		hours: Number(hours),
		// 		minutes: Number(minutes),
		// 		seconds: Number(seconds),
		// 	},
		// 	timeIncrement: Number(timeIncrement),
		// }
		// save
	}

	return (
		<View style={styles.container}>
			<View style={styles.actionsContainer}>
				<IconButton
					onPress={() => setIsTimeModalVisible(true)}
					iconName="plus"
					title="Add preset"
				/>
			</View>

			<View>
				<FlatList
					data={orderPresetsByDuration(presets)}
					keyExtractor={(item) => item.name}
					renderItem={({ item }) => {
						return (
							<TouchableOpacity
								onPress={() => handleSelectPreset(item)}
								activeOpacity={0.75}
							>
								<ConfigBox
									title={item.name}
									isIcon={true}
									valueName="chevron-right"
								/>
							</TouchableOpacity>
						)
					}}
				/>
			</View>

			<Modal
				isVisible={isTimeModalVisible}
				onBackButtonPress={() => setIsTimeModalVisible(false)}
				onBackdropPress={() => setIsTimeModalVisible(false)}
			>
				<View style={styles.timeModalContainer}>
					<Text style={styles.timeModalText}>Create new preset time</Text>

					<View style={styles.timeModalInputsContainer}>
						<View style={styles.timeModalInputContainer}>
							<TextInput
								style={styles.timeModalInput}
								onChangeText={setHours}
								value={hours}
								maxLength={2}
								placeholder="00"
								keyboardType="numeric"
							/>
						</View>

						<Text style={styles.timeModalColon}>:</Text>

						<View style={styles.timeModalInputContainer}>
							<TextInput
								style={styles.timeModalInput}
								onChangeText={(t) => {
									Number(t) > 59 ? setMinutes("59") : setMinutes(t)
								}}
								value={minutes}
								maxLength={2}
								placeholder="00"
								keyboardType="numeric"
							/>
						</View>

						<Text style={styles.timeModalColon}>:</Text>

						<View style={styles.timeModalInputContainer}>
							<TextInput
								style={styles.timeModalInput}
								onChangeText={(t) => {
									Number(t) > 59 ? setSeconds("59") : setSeconds(t)
								}}
								value={seconds}
								maxLength={2}
								placeholder="00"
								keyboardType="numeric"
							/>
						</View>
					</View>

					<View style={styles.configContainer}>
						<Text style={styles.configText}>Extra seconds</Text>
						<View>
							<TextInput
								style={styles.timeIncrementInput}
								onChangeText={(t) => {
									Number(t) > 59 ? setTimeIncrement("59") : setTimeIncrement(t)
								}}
								value={timeIncrement}
								maxLength={2}
								placeholder="0"
								placeholderTextColor={theme.colors.grayDark}
								keyboardType="numeric"
							/>
						</View>
					</View>

					<View style={styles.timeModalActionsContainer}>
						<TouchableOpacity onPress={() => setIsTimeModalVisible(false)}>
							<Text style={styles.timeModalText}>Cancel</Text>
						</TouchableOpacity>

						<TouchableOpacity onPress={handleSaveModal}>
							<Text style={[styles.timeModalText, { marginLeft: theme.spacing.l }]}>
								Save
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundDark,
	},
	actionsContainer: {
		alignItems: "center",
		marginVertical: theme.spacing.xs,
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
})
