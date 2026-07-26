import {
	isEmptyTime,
	parseHoursToText,
	parseMinutesToText,
	parseNumberToTimeInput,
	parseSecondsToText,
	parseStringToNumber,
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
	const { time, timeInMilliseconds, setTime, setName, setIncrement } = useTimeStore()
	const {
		secondTime,
		secondTimeInMilliseconds,
		setSecondTime,
		setSecondName,
		setSecondIncrement,
	} = useSecondTimeStore()
	const {
		orientation,
		setOrientation,
		soundEnabled,
		toggleSoundEnabled,
		withDifferentTimes,
		toggleWithDifferentTimes,
	} = useConfigStore()

	const [isTimeModalVisible, setIsTimeModalVisible] = useState<boolean>(false)
	const [incrementInput, setIncrementInput] = useState<string>(time.timeIncrementMs?.toString())
	const [hours, setHours] = useState<string>("")
	const [minutes, setMinutes] = useState<string>("")
	const [seconds, setSeconds] = useState<string>("")

	const [isSecondTimeModalVisible, setIsSecondTimeModalVisible] = useState<boolean>(false)
	const [secondIncrementInput, setSecondIncrementInput] = useState<string>("")
	const [secondHours, setSecondHours] = useState<string>("")
	const [secondMinutes, setSecondMinutes] = useState<string>("")
	const [secondSeconds, setSecondSeconds] = useState<string>("")

	// A clock that starts at zero has nothing to play — this also covers times
	// persisted as 00:00:00 by an earlier version.
	const isStartDisabled =
		timeInMilliseconds === 0 || (withDifferentTimes && secondTimeInMilliseconds === 0)

	// Seeding the inputs from the current time keeps a blank confirm from meaning
	// 00:00:00, and clears whatever was typed the last time the modal was open.
	function handleOpenTimeModal() {
		setHours(parseNumberToTimeInput(time.time.hours))
		setMinutes(parseNumberToTimeInput(time.time.minutes))
		setSeconds(parseNumberToTimeInput(time.time.seconds))
		setIsTimeModalVisible(true)
	}

	function handleOpenSecondTimeModal() {
		setSecondHours(parseNumberToTimeInput(secondTime.time.hours))
		setSecondMinutes(parseNumberToTimeInput(secondTime.time.minutes))
		setSecondSeconds(parseNumberToTimeInput(secondTime.time.seconds))
		setIsSecondTimeModalVisible(true)
	}

	function handleSaveModal() {
		const newTime = {
			hours: parseStringToNumber(hours),
			minutes: parseStringToNumber(minutes),
			seconds: parseStringToNumber(seconds),
		}
		if (isEmptyTime(newTime)) return

		setTime({
			name: "Custom",
			time: newTime,
			timeIncrementMs: time.timeIncrementMs,
		})
		setIsTimeModalVisible(false)
	}

	function handleSaveSecondModal() {
		const newSecondTime = {
			hours: parseStringToNumber(secondHours),
			minutes: parseStringToNumber(secondMinutes),
			seconds: parseStringToNumber(secondSeconds),
		}
		if (isEmptyTime(newSecondTime)) return

		setSecondTime({
			name: "Custom",
			time: newSecondTime,
			timeIncrementMs: secondTime.timeIncrementMs,
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
					{withDifferentTimes ? (
						<>
							<TouchableOpacity
								onPress={() =>
									navigation.navigate("Presets", { target: "primary" })
								}
							>
								<ConfigBox
									title={`${t("configs.presets")} 1`}
									valueName={time.name}
								/>
							</TouchableOpacity>

							<TouchableOpacity
								onPress={() => navigation.navigate("Presets", { target: "second" })}
							>
								<ConfigBox
									title={`${t("configs.presets")} 2`}
									valueName={secondTime.name}
								/>
							</TouchableOpacity>
						</>
					) : (
						<TouchableOpacity
							onPress={() => navigation.navigate("Presets", { target: "both" })}
						>
							<ConfigBox title={t("configs.presets")} valueName={time.name} />
						</TouchableOpacity>
					)}

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
							onPress={handleOpenTimeModal}
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
											? setIncrement(59000)
											: setIncrement(parseStringToNumber(t) * 1000)
										time.name !== "Custom" ? setName("Custom") : null
									}}
									value={
										time.name === "Custom"
											? incrementInput
											: (time.timeIncrementMs / 1000).toString()
									}
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
								onPress={handleOpenSecondTimeModal}
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
												? setSecondIncrement(59000)
												: setSecondIncrement(parseStringToNumber(t) * 1000)
											secondTime.name !== "Custom"
												? setSecondName("Custom")
												: null
										}}
										value={
											secondTime.name === "Custom"
												? secondIncrementInput
												: (secondTime.timeIncrementMs / 1000).toString()
										}
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
						disabled={isStartDisabled}
						style={[styles.startBtn, isStartDisabled ? styles.startBtnDisabled : null]}
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
	startBtnDisabled: {
		opacity: 0.4,
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
