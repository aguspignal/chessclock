import { ClockOrientation } from "../types/utils"
import { parseTimeFromSeconds } from "../utils/parsing"
import { STATUS_BAR_HEIGHT } from "../utils/constants"
import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native"
import { theme } from "../resources/theme"

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
}: Props) {
	const verticalOrientationStyle: StyleProp<ViewStyle> =
		isTopPlayer && clockOrientation === "Vertical"
			? {
					transform: [{ rotate: "180deg" }],
					paddingBottom: STATUS_BAR_HEIGHT / 1.2,
			  }
			: {}

	const horizontalOrientationTextStyle: StyleProp<ViewStyle> =
		clockOrientation === "Horizontal" ? { transform: [{ rotate: "90deg" }] } : {}

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
			style={[styles.container]}
			activeOpacity={0.9}
		>
			<View style={[styles.clockContainer, clockColorStyle, verticalOrientationStyle]}>
				<View style={[horizontalOrientationTextStyle, { alignItems: "center" }]}>
					<Text style={[styles.timer]}>{parseTimeFromSeconds(playerClock)}</Text>
					<Text style={[styles.extraInfoText]}>Moves: {movesCount}</Text>
				</View>
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
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	extraInfoText: {
		color: "#888888",
		fontSize: theme.fontSize.s,
	},
	timer: {
		color: theme.colors.textDark,
		fontSize: 84,
		fontWeight: "600",
	},
})
