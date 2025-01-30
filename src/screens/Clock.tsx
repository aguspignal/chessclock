import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { ClockProps } from "../types/navigation"
import { theme } from "../utils/theme"
import Icon from "@react-native-vector-icons/material-design-icons"
// import { useState } from "react"
// import { STATUS_BAR_HEIGHT } from "../utils/constants"

export default function Clock({ navigation, route }: ClockProps) {
	// const [clock, setclock] = useState<string>("")

	const time = route.params.time
	const extraSeconds = route.params.extraSeconds

	const displayHours =
		time.hours > 0 ? (time.hours < 10 ? `0${time.hours}:` : `${time.hours}:`) : ""
	const displayMinutes =
		time.minutes > 0 ? (time.minutes < 10 ? `0${time.minutes}` : time.minutes) : "00"
	const displaySeconds =
		time.seconds > 0 ? (time.seconds < 10 ? `0${time.seconds}` : time.seconds) : "00"
	const displayExtraSeconds = extraSeconds > 0 ? ` | ${extraSeconds}s` : ""

	function handleExitClock() {
		navigation.navigate("Home")
	}

	function handleToggleClock() {}

	function handleRestartClock() {}

	return (
		<View style={styles.container}>
			<View style={[styles.clockContainer, styles.topContainer]}>
				<Text style={styles.extraInfoText}>Moves: 0</Text>

				<Text style={styles.timer}>
					{displayHours + displayMinutes + ":" + displaySeconds}
				</Text>

				<Text style={styles.extraInfoText}>
					{displayHours + displayMinutes + ":" + displaySeconds + displayExtraSeconds}
				</Text>
			</View>

			<View style={styles.actionsContainer}>
				<TouchableOpacity onPress={handleExitClock}>
					<Icon name="cancel" size={theme.fontSize.xl} color={theme.colors.textLight} />
				</TouchableOpacity>

				<TouchableOpacity onPress={handleToggleClock}>
					<Icon name="play" size={theme.fontSize.xl} color={theme.colors.textLight} />
				</TouchableOpacity>

				<TouchableOpacity onPress={handleRestartClock}>
					<Icon name="restart" size={theme.fontSize.xl} color={theme.colors.textLight} />
				</TouchableOpacity>
			</View>

			<View style={styles.clockContainer}>
				<Text style={styles.extraInfoText}>Moves: 0</Text>

				<Text style={styles.timer}>
					{displayHours + displayMinutes + ":" + displaySeconds}
				</Text>

				<Text style={styles.extraInfoText}>
					{displayHours + displayMinutes + ":" + displaySeconds + displayExtraSeconds}
				</Text>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundDark,
	},
	topContainer: {
		// paddingBottom: STATUS_BAR_HEIGHT - STATUS_BAR_HEIGHT / 3,
		transform: [{ rotate: "-180deg" }],
	},
	clockContainer: {
		flex: 1,
		backgroundColor: theme.colors.grayLight,
		justifyContent: "space-between",
		alignItems: "center",
	},
	extraInfoText: {
		fontSize: theme.fontSize.s,
		color: theme.colors.grayDark,
		marginVertical: theme.spacing.xxs,
	},
	timer: {
		fontSize: 80,
		fontWeight: "600",
		color: theme.colors.textDark,
	},
	actionsContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: theme.spacing.xs,
		paddingHorizontal: theme.spacing.xl,
	},
})
