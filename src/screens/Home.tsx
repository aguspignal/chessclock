import {
	isEmptyTime,
	parseNumberToTimeInput,
	parseStringToNumber,
} from "../utils/parsing"
import {
	KeyboardAvoidingView,
	ScrollView,
	StyleSheet,
	Text,
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
import Card, { CardDivider } from "../components/Card"
import HomeSettings from "../components/HomeSettings"
import PlayerTimeCard from "../components/PlayerTimeCard"
import PresetRow from "../components/PresetRow"
import React from "react"
import TimeCard from "../components/TimeCard"
import TimeInputModal from "../components/TimeInputModal"

export default function Home({ navigation }: HomeProps) {
	const { t } = useTranslation()
	const headerHeight = useHeaderHeight()
	const { time, timeInMilliseconds, setTime, setName, setIncrement } =
		useTimeStore()
	const { secondTime, secondTimeInMilliseconds, setSecondTime } =
		useSecondTimeStore()
	const { withDifferentTimes } = useConfigStore()

	const [isTimeModalVisible, setIsTimeModalVisible] = useState<boolean>(false)
	const [hours, setHours] = useState<string>("")
	const [minutes, setMinutes] = useState<string>("")
	const [seconds, setSeconds] = useState<string>("")
	const [incrementInput, setIncrementInput] = useState<string>("")

	const [isSecondTimeModalVisible, setIsSecondTimeModalVisible] =
		useState<boolean>(false)
	const [secondHours, setSecondHours] = useState<string>("")
	const [secondMinutes, setSecondMinutes] = useState<string>("")
	const [secondSeconds, setSecondSeconds] = useState<string>("")
	const [secondIncrementInput, setSecondIncrementInput] = useState<string>("")

	// A clock that starts at zero has nothing to play — this also covers times
	// persisted as 00:00:00 by an earlier version.
	const isStartDisabled =
		timeInMilliseconds === 0 ||
		(withDifferentTimes && secondTimeInMilliseconds === 0)

	// Seeding the inputs from the current time keeps a blank confirm from meaning
	// 00:00:00, and clears whatever was typed the last time the modal was open.
	function handleOpenTimeModal() {
		setHours(parseNumberToTimeInput(time.time.hours))
		setMinutes(parseNumberToTimeInput(time.time.minutes))
		setSeconds(parseNumberToTimeInput(time.time.seconds))
		setIncrementInput(String(Math.floor(time.timeIncrementMs / 1000)))
		setIsTimeModalVisible(true)
	}

	function handleOpenSecondTimeModal() {
		setSecondHours(parseNumberToTimeInput(secondTime.time.hours))
		setSecondMinutes(parseNumberToTimeInput(secondTime.time.minutes))
		setSecondSeconds(parseNumberToTimeInput(secondTime.time.seconds))
		setSecondIncrementInput(
			String(Math.floor(secondTime.timeIncrementMs / 1000)),
		)
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
			timeIncrementMs: parseStringToNumber(incrementInput) * 1000,
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
			timeIncrementMs: parseStringToNumber(secondIncrementInput) * 1000,
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
					<View style={styles.presetsContainer}>
						<Card>
							{withDifferentTimes ? (
								<>
									<PresetRow
										label={`${t("configs.presets")} 1`}
										value={time.name}
										onPress={() =>
											navigation.navigate("Presets", {
												target: "primary",
											})
										}
									/>

									<CardDivider />

									<PresetRow
										label={`${t("configs.presets")} 2`}
										value={secondTime.name}
										onPress={() =>
											navigation.navigate("Presets", {
												target: "second",
											})
										}
									/>
								</>
							) : (
								<PresetRow
									label={t("configs.presets")}
									value={time.name}
									onPress={() =>
										navigation.navigate("Presets", {
											target: "both",
										})
									}
								/>
							)}
						</Card>
					</View>

					<View style={styles.timeConfigContainer}>
						{withDifferentTimes ? (
							<View style={styles.playerCardsContainer}>
								<PlayerTimeCard
									label={t("players.white")}
									time={time.time}
									incrementMs={time.timeIncrementMs}
									onPress={handleOpenTimeModal}
								/>

								<PlayerTimeCard
									label={t("players.black")}
									time={secondTime.time}
									incrementMs={secondTime.timeIncrementMs}
									onPress={handleOpenSecondTimeModal}
									isBlack
								/>
							</View>
						) : (
							<TimeCard
								time={time.time}
								incrementMs={time.timeIncrementMs}
								onPressTime={handleOpenTimeModal}
								onChangeIncrementMs={(ms) => {
									setIncrement(ms)
									if (time.name !== "Custom")
										setName("Custom")
								}}
							/>
						)}
					</View>

					<View style={styles.settingsContainer}>
						<HomeSettings />
					</View>
				</View>

				<TouchableOpacity
					onPress={() => navigation.navigate("Clock")}
					disabled={isStartDisabled}
					style={[
						styles.startBtn,
						isStartDisabled ? styles.startBtnDisabled : null,
					]}
					activeOpacity={0.8}
				>
					<Text style={styles.startBtnText}>
						{t("actions.start")}
					</Text>
				</TouchableOpacity>
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
				withIncrementInput={withDifferentTimes}
				increment={incrementInput}
				setIncrement={setIncrementInput}
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
				withIncrementInput
				increment={secondIncrementInput}
				setIncrement={setSecondIncrementInput}
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
	presetsContainer: {
		marginTop: theme.spacing.s,
	},
	timeConfigContainer: {
		marginTop: theme.spacing.s,
	},
	playerCardsContainer: {
		flexDirection: "row",
		gap: theme.spacing.xs,
		marginHorizontal: theme.spacing.s,
	},
	settingsContainer: {
		marginTop: theme.spacing.l,
	},
	startBtn: {
		alignItems: "center",
		backgroundColor: theme.colors.accent,
		borderRadius: theme.spacing.xs,
		marginHorizontal: theme.spacing.s,
		marginVertical: theme.spacing.xl,
		paddingVertical: theme.spacing.s,
	},
	startBtnDisabled: {
		opacity: 0.4,
	},
	startBtnText: {
		color: theme.colors.textDark,
		fontSize: theme.fontSize.l,
		fontWeight: "600",
	},
})
