import { ClockOrientation, Preset, PresetTime } from "../types/utils"
import { HomeProps } from "../types/navigation"
import { parseHoursToText, parseMinutesToText, parseSecondsToText } from "../utils/parsing"
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { theme } from "../resources/theme"
import { useEffect, useState } from "react"
import ConfigBox from "../components/ConfigBox"
import React from "react"
import TimeInputModal from "../components/TimeInputModal"

export default function Home({ navigation, route }: HomeProps) {
	const [defaultPreset, setDefaultPreset] = useState<Preset>(route.params.defaultPreset)
	const [clockOrientation, setClockOrientation] = useState<ClockOrientation>("Horizontal")
	const [sound, setSound] = useState<boolean>(true)
	const [withDifferentTimes, setWithDifferentTimes] = useState<boolean>(false)

	const [isTimeModalVisible, setIsTimeModalVisible] = useState<boolean>(false)
	const [hours, setHours] = useState<string>("")
	const [minutes, setMinutes] = useState<string>("")
	const [seconds, setSeconds] = useState<string>("")
	const [timeIncrement, setTimeIncrement] = useState<string>("")

	const [isSecondTimeModalVisible, setIsSecondTimeModalVisible] = useState<boolean>(false)
	const [secondHours, setSecondHours] = useState<string>("")
	const [secondMinutes, setSecondMinutes] = useState<string>("")
	const [secondSeconds, setSecondSeconds] = useState<string>("")
	const [secondTimeIncrement, setSecondTimeIncrement] = useState<string>("")

	const [time, setTime] = useState<PresetTime>({ hours: 0, minutes: 0, seconds: 0 })
	const [secondTime, setSecondTime] = useState<PresetTime>({ hours: 0, minutes: 0, seconds: 0 })

	const customPreset: Preset = {
		name: "Custom",
		time: { hours: 0, minutes: 0, seconds: 0 },
		timeIncrement: 0,
	}

	function handleSaveModal() {
		setTime({
			hours: hours.length === 0 || isNaN(Number(hours)) ? 0 : Number(hours),
			minutes: minutes.length === 0 || isNaN(Number(minutes)) ? 0 : Number(minutes),
			seconds: seconds.length === 0 || isNaN(Number(seconds)) ? 0 : Number(seconds),
		})
		setIsTimeModalVisible(false)
		setDefaultPreset(customPreset)
	}

	function handleSaveSecondModal() {
		setSecondTime({
			hours: secondHours.length === 0 || isNaN(Number(secondHours)) ? 0 : Number(secondHours),
			minutes:
				secondMinutes.length === 0 || isNaN(Number(secondMinutes))
					? 0
					: Number(secondMinutes),
			seconds:
				secondSeconds.length === 0 || isNaN(Number(secondSeconds))
					? 0
					: Number(secondSeconds),
		})
		setIsSecondTimeModalVisible(false)
		setDefaultPreset(customPreset)
	}

	function handleStart() {
		navigation.navigate("Clock", {
			time,
			timeIncrement: isNaN(Number(timeIncrement)) ? 0 : Number(timeIncrement),
			isSoundEnabled: sound,
			clockOrientation,
			secondTime: withDifferentTimes ? secondTime : null,
			secondTimeIncrement: withDifferentTimes
				? isNaN(Number(secondTimeIncrement))
					? 0
					: Number(secondTimeIncrement)
				: null,
		})
	}

	useEffect(() => {
		setTime({
			hours: defaultPreset.time.hours,
			minutes: defaultPreset.time.minutes,
			seconds: defaultPreset.time.seconds,
		})
		setTimeIncrement(`${defaultPreset.timeIncrement}`)
	}, [])

	return (
		<View style={styles.container}>
			<View>
				<TouchableOpacity onPress={() => navigation.navigate("Presets")}>
					<ConfigBox title="Preset time" valueName={defaultPreset.name} />
				</TouchableOpacity>

				<ConfigBox
					title="Clock orientation"
					isDropdown
					dropdownData={[
						{ label: "Vertical", value: "Vertical" },
						{ label: "Horizontal", value: "Horizontal" },
					]}
					onDropdownChange={setClockOrientation}
					dropdownDefaultValue={clockOrientation}
				/>

				<TouchableOpacity onPress={() => setSound(!sound)} activeOpacity={1}>
					<ConfigBox
						title="Sound"
						valueName={sound ? "volume-high" : "volume-mute"}
						isIcon
					/>
				</TouchableOpacity>

				<TouchableOpacity
					onPress={() => setWithDifferentTimes(!withDifferentTimes)}
					activeOpacity={1}
				>
					<ConfigBox
						title="Different times"
						valueName="toggle"
						isToggle
						toggleValue={withDifferentTimes}
						onToggleChange={setWithDifferentTimes}
					/>
				</TouchableOpacity>

				<View style={styles.timeConfigContainer}>
					<TouchableOpacity
						onPress={() => setIsTimeModalVisible(true)}
						style={styles.clockContainer}
					>
						<View style={styles.timeContainer}>
							{parseHoursToText(time.hours)}
							{parseMinutesToText(time.minutes)}
							{parseSecondsToText(time.seconds)}
						</View>
					</TouchableOpacity>

					<View style={styles.configContainer}>
						<Text style={styles.configText}>Time increment</Text>
						<View>
							<TextInput
								style={styles.timeIncrementInput}
								onChangeText={(t) => {
									Number(t) > 59 ? setTimeIncrement("59") : setTimeIncrement(t)
									setDefaultPreset(customPreset)
								}}
								value={timeIncrement}
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
								{parseHoursToText(secondTime.hours)}
								{parseMinutesToText(secondTime.minutes)}
								{parseSecondsToText(secondTime.seconds)}
							</View>
						</TouchableOpacity>

						<View style={styles.configContainer}>
							<Text style={styles.configText}>Time increment</Text>
							<View>
								<TextInput
									style={styles.timeIncrementInput}
									onChangeText={(t) => {
										Number(t) > 59
											? setSecondTimeIncrement("59")
											: setSecondTimeIncrement(t)
									}}
									value={secondTimeIncrement}
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
				<TouchableOpacity onPress={handleStart} style={styles.startBtn} activeOpacity={0.8}>
					<Text style={styles.startBtnText}>Start Game</Text>
				</TouchableOpacity>
			</View>

			<TimeInputModal
				isVisible={isTimeModalVisible}
				setIsVisible={setIsTimeModalVisible}
				title="Adjust time"
				saveActionTitle="Confirm"
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
				title="Adjust time"
				saveActionTitle="Confirm"
				onSave={handleSaveSecondModal}
				hours={secondHours}
				minutes={secondMinutes}
				seconds={secondSeconds}
				setHours={setSecondHours}
				setMinutes={setSecondMinutes}
				setSeconds={setSecondSeconds}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: theme.colors.backgroundDark,
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
		padding: theme.spacing.s,
	},
	timeText: {
		fontSize: theme.fontSize.xl,
		fontWeight: "500",
	},
	startBtnContainer: {
		alignItems: "center",
	},
	startBtn: {
		backgroundColor: theme.colors.grayLight,
		borderRadius: theme.spacing.xxs,
		marginVertical: theme.spacing.xxl,
		paddingHorizontal: theme.spacing.m,
		paddingVertical: theme.spacing.s,
	},
	startBtnText: {
		fontSize: theme.fontSize.s,
		fontWeight: "500",
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
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "center",
		marginVertical: theme.spacing.s,
		paddingHorizontal: theme.spacing.s,
	},
	configText: {
		color: theme.colors.textLight,
		fontSize: theme.fontSize.s,
		fontWeight: "500",
	},
	timeIncrementInput: {
		borderBottomColor: theme.colors.textLight,
		borderBottomWidth: 2,
		color: theme.colors.textLight,
		fontSize: theme.fontSize.m,
		fontWeight: "500",
		marginLeft: theme.spacing.xxs,
		paddingHorizontal: theme.spacing.xxs,
	},
})
