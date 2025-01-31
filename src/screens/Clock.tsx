import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { ClockProps } from "../types/navigation"
import { theme } from "../utils/theme"
import Icon from "@react-native-vector-icons/material-design-icons"
import { useEffect, useState } from "react"
import { parseTimeFromSeconds, parseTimeWithExtra } from "../utils/parsing"
import { STATUS_BAR_HEIGHT } from "../utils/constants"

export default function Clock({ navigation, route }: ClockProps) {
	const time = route.params.time
	const timeInSeconds = time.hours * 3600 + time.minutes * 60 + time.seconds
	const extraSeconds = route.params.extraSeconds

	const [topPlayerClock, setTopPlayerClock] = useState(timeInSeconds)
	const [bottomPlayerClock, setBottomPlayerClock] = useState(timeInSeconds)

	const [isTopRunning, setIsTopRunning] = useState(false)
	const [isBottomRunning, setIsBottomRunning] = useState(false)
	const [intervalId, setIntervalId] = useState<NodeJS.Timeout>()

	const [topPlayerCount, setTopPlayerCount] = useState<number>(0)
	const [bottomPlayerCount, setBottomPlayerCount] = useState<number>(0)
	const [lastMoveWasTop, setLastMoveWasTop] = useState<boolean>(false)

	function handleExitClock() {
		navigation.popToTop()
	}

	function handleStartPause() {
		if (isTopRunning || isBottomRunning) {
			stopTopPlayerTimer()
			stopBottomPlayerTimer()
		} else {
			lastMoveWasTop ? startBottomPlayerTimer() : startTopPlayerTimer()
		}
	}

	const restartClock = () => {
		clearInterval(intervalId)
		setIsTopRunning(false)
		setIsBottomRunning(false)
		setTopPlayerClock(timeInSeconds)
		setBottomPlayerClock(timeInSeconds)
		setTopPlayerCount(0)
		setBottomPlayerCount(0)
	}

	function handleMove(topPlayerMoved: boolean) {
		if (topPlayerMoved && isTopRunning) {
			stopTopPlayerTimer()
			startBottomPlayerTimer()
			setTopPlayerCount((prev) => prev + 1)
			setLastMoveWasTop(true)
		} else if (!topPlayerMoved && isBottomRunning) {
			stopBottomPlayerTimer()
			startTopPlayerTimer()
			setBottomPlayerCount((prev) => prev + 1)
			setLastMoveWasTop(false)
		} else if (!isTopRunning && !isBottomRunning) {
			topPlayerMoved ? startTopPlayerTimer() : startBottomPlayerTimer()
		}
	}

	const startTopPlayerTimer = () => {
		if (isTopRunning || topPlayerClock === 0) return
		setIsTopRunning(true)

		setTopPlayerClock((prev) => prev - 1)

		const id = setInterval(() => {
			setTopPlayerClock((prev) => {
				if (prev <= 1) {
					clearInterval(id)
					setIsTopRunning(false)
					return 0
				}
				return prev - 1
			})
		}, 1000)
		setIntervalId(id)
	}

	const stopTopPlayerTimer = () => {
		clearInterval(intervalId)
		setIsTopRunning(false)
	}

	const startBottomPlayerTimer = () => {
		if (isBottomRunning || bottomPlayerClock === 0) return
		setIsBottomRunning(true)

		setBottomPlayerClock((prev) => prev - 1)

		const id = setInterval(() => {
			setBottomPlayerClock((prev) => {
				if (prev <= 1) {
					clearInterval(id)
					setIsBottomRunning(false)
					return 0
				}
				return prev - 1
			})
		}, 1000)
		setIntervalId(id)
	}

	const stopBottomPlayerTimer = () => {
		clearInterval(intervalId)
		setIsBottomRunning(false)
	}

	useEffect(() => {
		return () => clearInterval(intervalId)
	}, [intervalId])

	return (
		<View style={styles.container}>
			<TouchableOpacity
				onPress={() => handleMove(true)}
				style={[
					styles.clockContainer,
					styles.topContainer,
					isTopRunning
						? topPlayerClock === 0
							? { backgroundColor: theme.colors.red }
							: topPlayerClock <= 10
							? { backgroundColor: theme.colors.orange }
							: topPlayerClock <= 30
							? { backgroundColor: theme.colors.yellow }
							: { backgroundColor: theme.colors.green }
						: { backgroundColor: theme.colors.grayLight },
				]}
				activeOpacity={0.8}
			>
				<Text style={styles.extraInfoText}>Moves: {topPlayerCount}</Text>

				<Text style={styles.timer}>{parseTimeFromSeconds(topPlayerClock)}</Text>

				<Text style={styles.extraInfoText}>
					{parseTimeWithExtra(timeInSeconds, extraSeconds)}
				</Text>
			</TouchableOpacity>

			<View style={styles.actionsContainer}>
				<TouchableOpacity onPress={handleExitClock}>
					<Icon name="cancel" size={theme.fontSize.xl} color={theme.colors.textLight} />
				</TouchableOpacity>

				<TouchableOpacity onPress={handleStartPause}>
					<Icon
						name={isTopRunning || isBottomRunning ? "pause" : "play"}
						size={theme.fontSize.xl}
						color={theme.colors.textLight}
					/>
				</TouchableOpacity>

				<TouchableOpacity onPress={restartClock}>
					<Icon name="restart" size={theme.fontSize.xl} color={theme.colors.textLight} />
				</TouchableOpacity>
			</View>

			<TouchableOpacity
				onPress={() => handleMove(false)}
				style={[
					styles.clockContainer,
					isBottomRunning
						? bottomPlayerClock === 0
							? { backgroundColor: theme.colors.red }
							: bottomPlayerClock <= 10
							? { backgroundColor: theme.colors.orange }
							: bottomPlayerClock <= 30
							? { backgroundColor: theme.colors.yellow }
							: { backgroundColor: theme.colors.green }
						: { backgroundColor: theme.colors.grayLight },
				]}
				activeOpacity={0.95}
			>
				<Text style={styles.extraInfoText}>Moves: {bottomPlayerCount}</Text>

				<Text style={styles.timer}>{parseTimeFromSeconds(bottomPlayerClock)}</Text>

				<Text style={styles.extraInfoText}>
					{parseTimeWithExtra(timeInSeconds, extraSeconds)}
				</Text>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundDark,
	},
	topContainer: {
		paddingBottom: STATUS_BAR_HEIGHT - STATUS_BAR_HEIGHT / 3,
		transform: [{ rotate: "-180deg" }],
	},
	clockContainer: {
		flex: 1,
		justifyContent: "space-between",
		alignItems: "center",
	},
	extraInfoText: {
		fontSize: theme.fontSize.s,
		color: theme.colors.textDark,
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
