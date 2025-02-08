import { parseTimeFromSeconds, parseTimeWithExtra } from "../utils/parsing"
import { STATUS_BAR_HEIGHT } from "../utils/constants"
import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native"
import { theme } from "../utils/theme"

type Props = {
	isTopPlayer: boolean
	isPlaying: boolean
	onMove: (topPlayerMoved: boolean) => void
	clockOrientation: ClockOrientation
	movesCount: number
	playerClock: number
	timeInSeconds: number
	timeIncrement: number
}

export default function PlayerClock({
	isTopPlayer,
	isPlaying,
	onMove,
	clockOrientation,
	movesCount,
	playerClock,
	timeInSeconds,
	timeIncrement,
}: Props) {
	const clockOrientationStyle = isTopPlayer
		? clockOrientation === "Horizontal"
			? { transform: [{ rotate: "-90deg" }] }
			: { transform: [{ rotate: "-180deg" }] }
		: clockOrientation === "Horizontal"
		? { transform: [{ rotate: "-90deg" }] }
		: {}
	const clockColorStyle: StyleProp<ViewStyle> =
		playerClock === 0
			? {}
			: !isPlaying
			? { backgroundColor: theme.colors.grayLight }
			: playerClock <= 10
			? { backgroundColor: theme.colors.orange }
			: playerClock <= 30
			? { backgroundColor: theme.colors.yellow }
			: { backgroundColor: theme.colors.green }

	return (
		<TouchableOpacity
			onPress={() => onMove(isTopPlayer)}
			style={[styles.container, clockOrientationStyle]}
			activeOpacity={0.9}
		>
			<View
				style={[
					styles.clockContainer,
					clockColorStyle,
					isTopPlayer && clockOrientation === "Vertical"
						? { paddingBottom: STATUS_BAR_HEIGHT }
						: {},
				]}
			>
				<Text style={styles.extraInfoText}>Moves: {movesCount}</Text>

				<Text style={styles.timer}>{parseTimeFromSeconds(playerClock)}</Text>

				<Text style={styles.extraInfoText}>
					{parseTimeWithExtra(timeInSeconds, timeIncrement)}
				</Text>
			</View>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: theme.colors.red,
		flex: 1,
	},
	clockContainer: {
		alignItems: "center",
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
