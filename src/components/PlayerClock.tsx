import { parseTimeFromMilliseconds, parseTimeToMilisecondsString } from "../utils/parsing"
import { ROTATED_CLOCK_PADDING } from "../utils/constants"
import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native"
import { theme } from "../resources/theme"
import { useConfigStore } from "../stores/useConfigStore"
import { useTranslation } from "react-i18next"
import Icon from "@expo/vector-icons/MaterialCommunityIcons"

type Props = {
	isTopPlayer: boolean
	isGameOver: boolean
	isPlaying: boolean
	onMove: (topPlayerMoved: boolean) => void
	movesCount: number
	playerClock: number
}

export default function PlayerClock({
	isTopPlayer,
	isGameOver,
	isPlaying,
	onMove,
	movesCount,
	playerClock,
}: Props) {
	const { t } = useTranslation()
	const { orientation } = useConfigStore()

	const verticalOrientationStyle: StyleProp<ViewStyle> =
		isTopPlayer && orientation === "Vertical" ? styles.verticalOrientation : null

	const horizontalOrientationTextStyle: StyleProp<ViewStyle> =
		orientation === "Horizontal" ? styles.horizontalOrientation : null

	const clockColorStyle: StyleProp<ViewStyle> =
		playerClock <= 0
			? {}
			: !isPlaying
			? styles.grayBg
			: playerClock <= 10000
			? styles.orangeBg
			: playerClock <= 30000
			? styles.yellowBg
			: styles.greenBg

	const hasWon = isGameOver && playerClock > 0

	return (
		<TouchableOpacity
			onPress={() => onMove(isTopPlayer)}
			style={[styles.container]}
			activeOpacity={isGameOver ? 1 : 0.9}
		>
			<View style={[styles.clockContainer, clockColorStyle, verticalOrientationStyle]}>
				<View style={[horizontalOrientationTextStyle, styles.alignCenter]}>
					{hasWon && (
						<Icon
							name="crown"
							size={theme.fontSize.h3}
							color={theme.colors.textDark}
						/>
					)}

					<Text style={[styles.timer, playerClock < 3600000 ? styles.biggerText : null]}>
						{parseTimeFromMilliseconds(playerClock)}

						<Text style={styles.miliseconds}>{`.${parseTimeToMilisecondsString(
							playerClock,
						)}`}</Text>
					</Text>

					<Text style={[styles.extraInfoText]}>
						{t("moves")}: {movesCount}
					</Text>
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
	verticalOrientation: {
		transform: [{ rotate: "180deg" }],
		paddingBottom: ROTATED_CLOCK_PADDING,
	},
	horizontalOrientation: {
		transform: [{ rotate: "90deg" }],
		alignItems: "center",
	},
	grayBg: {
		backgroundColor: theme.colors.grayLight,
	},
	yellowBg: {
		backgroundColor: theme.colors.yellow,
	},
	orangeBg: {
		backgroundColor: theme.colors.orange,
	},
	greenBg: {
		backgroundColor: theme.colors.green,
	},
	alignCenter: {
		alignItems: "center",
	},
	clockContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	extraInfoText: {
		color: theme.colors.textMuted,
		fontSize: theme.fontSize.s,
	},
	timer: {
		color: theme.colors.textDark,
		fontSize: theme.fontSize.h3 * 2,
		fontWeight: "600",
	},
	miliseconds: {
		fontSize: theme.fontSize.h3,
	},
	biggerText: {
		fontSize: theme.fontSize.h2 * 2,
	},
})
