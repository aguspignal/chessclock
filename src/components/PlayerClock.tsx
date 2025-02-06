import { parseTimeFromSeconds, parseTimeWithExtra } from "../utils/parsing"
import { STATUS_BAR_HEIGHT } from "../utils/constants"
import { StyleSheet, Text, TouchableOpacity } from "react-native"
import { theme } from "../utils/theme"

type Props = {
	isTopPlayer: boolean
	onMove: (topPlayerMoved: boolean) => void
	clockOrientation: ClockOrientation
	movesCount: number
	playerClock: number
	timeInSeconds: number
	timeIncrement: number
}

export default function PlayerClock({
	isTopPlayer,
	onMove,
	clockOrientation,
	movesCount,
	playerClock,
	timeInSeconds,
	timeIncrement,
}: Props) {
	const clockOrientationStyle = isTopPlayer
		? clockOrientation === "Vertical"
			? {
					transform: [{ rotate: "-180deg" }],
					paddingBottom: STATUS_BAR_HEIGHT - STATUS_BAR_HEIGHT / 3,
			  }
			: { transform: [{ rotate: "-90deg" }] }
		: clockOrientation === "Vertical"
		? {}
		: { transform: [{ rotate: "-90deg" }] }

	const clockColorStyle = {}

	// const topContainerColorStyle =
	// isTopRunning && topPlayerClock <= 10
	//     ? { backgroundColor: theme.colors.orange }
	//     : isTopRunning && topPlayerClock <= 30
	//     ? { backgroundColor: theme.colors.yellow }
	//     : isTopRunning
	//     ? { backgroundColor: theme.colors.green }
	//     : { backgroundColor: theme.colors.grayLight }

	return (
		<TouchableOpacity
			onPress={() => onMove(isTopPlayer)}
			style={[styles.clockContainer, clockOrientationStyle, clockColorStyle]}
			activeOpacity={0.9}
		>
			<Text style={styles.extraInfoText}>Moves: {movesCount}</Text>

			<Text style={styles.timer}>{parseTimeFromSeconds(playerClock)}</Text>

			<Text style={styles.extraInfoText}>
				{parseTimeWithExtra(timeInSeconds, timeIncrement)}
			</Text>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	clockContainer: {
		alignItems: "center",
		backgroundColor: theme.colors.grayLight,
		flex: 1,
		justifyContent: "space-between",
	},
	extraInfoText: {
		color: theme.colors.textDark,
		fontSize: theme.fontSize.s,
		marginVertical: theme.spacing.xxs,
	},
	timer: {
		color: theme.colors.textDark,
		fontSize: 80,
		fontWeight: "600",
	},
})
