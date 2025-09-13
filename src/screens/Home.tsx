import {
	parseHoursToText,
	parseStringToNumber,
	parseMinutesToText,
	parseSecondsToText,
} from "../utils/parsing"
import {
	KeyboardAvoidingView,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native"
import { HomeProps } from "../types/navigation"
import { theme } from "../resources/theme"
import { useConfigStore } from "../stores/useConfigStore"
import { useHeaderHeight } from "@react-navigation/elements"
import { useState } from "react"
import { useTimeStore, useSecondTimeStore } from "../stores/useTimeStore"
import { useTranslation } from "react-i18next"
import ConfigBox from "../components/ConfigBox"
import React from "react"
import TimeInputModal from "../components/TimeInputModal"

export default function Home({ navigation }: HomeProps) {
	const { t } = useTranslation()
	const headerHeight = useHeaderHeight()
	const { time, setTime, setName, setIncrement } = useTimeStore()
	const { secondTime, setSecondTime, setSecondName, setSecondIncrement } = useSecondTimeStore()
	const {
		orientation,
		setOrientation,
		soundEnabled,
		toggleSoundEnabled,
		withDifferentTimes,
		toggleWithDifferentTimes,
	} = useConfigStore()

	const [isTimeModalVisible, setIsTimeModalVisible] = useState<boolean>(false)
	const [incrementInput, setIncrementInput] = useState<string>(time.timeIncrement.toString())
	const [hours, setHours] = useState<string>("")
	const [minutes, setMinutes] = useState<string>("")
	const [seconds, setSeconds] = useState<string>("")

	const [isSecondTimeModalVisible, setIsSecondTimeModalVisible] = useState<boolean>(false)
	const [secondIncrementInput, setSecondIncrementInput] = useState<string>("")
	const [secondHours, setSecondHours] = useState<string>("")
	const [secondMinutes, setSecondMinutes] = useState<string>("")
	const [secondSeconds, setSecondSeconds] = useState<string>("")

	function handleSaveModal() {
		setTime({
			name: "Custom",
			time: {
				hours: parseStringToNumber(hours),
				minutes: parseStringToNumber(minutes),
				seconds: parseStringToNumber(seconds),
			},
			timeIncrement: time.timeIncrement,
		})
		setIsTimeModalVisible(false)
	}

	function handleSaveSecondModal() {
		setSecondTime({
			name: "Custom",
			time: {
				hours: parseStringToNumber(secondHours),
				minutes: parseStringToNumber(secondMinutes),
				seconds: parseStringToNumber(secondSeconds),
			},
			timeIncrement: time.timeIncrement,
		})
		setIsSecondTimeModalVisible(false)
	}

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<KeyboardAvoidingView
				behavior="padding"
				keyboardVerticalOffset={headerHeight}
				style={styles.keyboardviewContainer}
			>
				<View>
					<TouchableOpacity onPress={() => navigation.navigate("Presets")}>
						<ConfigBox title={t("configs.presets")} valueName={time.name} />
					</TouchableOpacity>

					<ConfigBox
						title={t("configs.orientation.orientation")}
						isDropdown
						dropdownData={[
							{ label: t("configs.orientation.vertical"), value: "Vertical" },
							{ label: t("configs.orientation.horizontal"), value: "Horizontal" },
						]}
						onDropdownChange={setOrientation}
						dropdownDefaultValue={orientation}
					/>

					<TouchableOpacity onPress={toggleSoundEnabled} activeOpacity={1}>
						<ConfigBox
							title={t("configs.sound")}
							valueName={soundEnabled ? "volume-high" : "volume-mute"}
							isIcon
						/>
					</TouchableOpacity>

					<TouchableOpacity onPress={toggleWithDifferentTimes} activeOpacity={1}>
						<ConfigBox
							title={t("configs.different-times")}
							valueName="toggle"
							isToggle
							toggleValue={withDifferentTimes}
							onToggleChange={toggleWithDifferentTimes}
						/>
					</TouchableOpacity>

					<View style={styles.timeConfigContainer}>
						<TouchableOpacity
							onPress={() => setIsTimeModalVisible(true)}
							style={styles.clockContainer}
						>
							<View style={styles.timeContainer}>
								{parseHoursToText(time.time.hours)}
								{parseMinutesToText(time.time.minutes)}
								{parseSecondsToText(time.time.seconds)}
							</View>
						</TouchableOpacity>

						<View style={styles.configContainer}>
							<Text style={styles.configText}>{t("increment")}</Text>
							<View>
								<TextInput
									style={styles.timeIncrementInput}
									onChangeText={(t) => {
										Number(t) > 59
											? setIncrementInput("59")
											: setIncrementInput(t)
										Number(t) > 59
											? setIncrement(59)
											: setIncrement(parseStringToNumber(t))
										time.name !== "Custom" ? setName("Custom") : null
									}}
									value={incrementInput}
									maxLength={2}
									placeholder="0"
									placeholderTextColor={theme.colors.grayDark}
									keyboardType="numeric"
								/>
							</View>
						</View>
					</View>

					{withDifferentTimes ? (
						<View style={styles.timeConfigContainer}>
							<TouchableOpacity
								onPress={() => setIsSecondTimeModalVisible(true)}
								style={styles.clockContainer}
							>
								<View style={styles.timeContainer}>
									{parseHoursToText(secondTime.time.hours)}
									{parseMinutesToText(secondTime.time.minutes)}
									{parseSecondsToText(secondTime.time.seconds)}
								</View>
							</TouchableOpacity>

							<View style={styles.configContainer}>
								<Text style={styles.configText}>{t("increment")}</Text>
								<View>
									<TextInput
										style={styles.timeIncrementInput}
										onChangeText={(t) => {
											Number(t) > 59
												? setSecondIncrementInput("59")
												: setSecondIncrementInput(t)
											Number(t) > 59
												? setSecondIncrement(59)
												: setSecondIncrement(parseStringToNumber(t))
											secondTime.name !== "Custom"
												? setSecondName("Custom")
												: null
										}}
										value={secondIncrementInput}
										maxLength={2}
										placeholder="0"
										placeholderTextColor={theme.colors.grayDark}
										keyboardType="numeric"
									/>
								</View>
							</View>
						</View>
					) : (
						<></>
					)}
				</View>

				<View style={styles.startBtnContainer}>
					<TouchableOpacity
						onPress={() => navigation.navigate("Clock")}
						style={styles.startBtn}
						activeOpacity={0.8}
					>
						<Text style={styles.startBtnText}>{t("actions.start")}</Text>
					</TouchableOpacity>
				</View>
			</KeyboardAvoidingView>

			<TimeInputModal
				isVisible={isTimeModalVisible}
				setIsVisible={setIsTimeModalVisible}
				title={t("adjust-time-title")}
				saveActionTitle={t("actions.confirm")}
				onSave={handleSaveModal}
				hours={hours}
				minutes={minutes}
				seconds={seconds}
				setHours={setHours}
				setMinutes={setMinutes}
				setSeconds={setSeconds}
			/>

			<TimeInputModal
				isVisible={isSecondTimeModalVisible}
				setIsVisible={setIsSecondTimeModalVisible}
				title={t("adjust-time-title")}
				saveActionTitle={t("actions.confirm")}
				onSave={handleSaveSecondModal}
				hours={secondHours}
				minutes={secondMinutes}
				seconds={secondSeconds}
				setHours={setSecondHours}
				setMinutes={setSecondMinutes}
				setSeconds={setSecondSeconds}
			/>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundDark,
	},
	keyboardviewContainer: {
		flex: 1,
		justifyContent: "space-between",
	},
	timeConfigContainer: {
		marginTop: theme.spacing.s,
	},
	clockContainer: {
		flexDirection: "row",
		justifyContent: "center",
	},
	timeContainer: {
		backgroundColor: theme.colors.grayLight,
		borderRadius: theme.spacing.xs,
		flexDirection: "row",
		padding: theme.spacing.xs,
	},
	timeText: {
		fontSize: theme.fontSize.xl,
	},
	startBtnContainer: {
		alignItems: "center",
		marginBottom: theme.spacing.s,
	},
	startBtn: {
		backgroundColor: theme.colors.grayLight,
		borderRadius: theme.spacing.xs,
		marginVertical: theme.spacing.xxl,
		paddingHorizontal: theme.spacing.m,
		paddingVertical: theme.spacing.s,
	},
	startBtnText: {
		fontSize: theme.fontSize.xl,
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
		marginVertical: theme.spacing.m,
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
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	configText: {
		color: theme.colors.textLight,
		fontSize: theme.fontSize.l,
		fontWeight: "500",
	},
	timeIncrementInput: {
		borderBottomColor: theme.colors.textLight,
		borderBottomWidth: 2,
		color: theme.colors.textLight,
		fontSize: theme.fontSize.xl,
		marginLeft: theme.spacing.xxs,
		paddingHorizontal: theme.spacing.xxs,
	},
})
