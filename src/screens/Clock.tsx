import { ClockProps } from "../types/navigation"
import { StyleSheet, View } from "react-native"
import { theme } from "../resources/theme"
import { useEffect, useState } from "react"
import IconButton from "../components/IconButton"
import PlayerClock from "../components/PlayerClock"

export default function Clock({ navigation, route }: ClockProps) {
	const time = route.params.time
	const timeInSeconds = time.hours * 3600 + time.minutes * 60 + time.seconds

	const secondTime = route.params.secondTime
	const secondTimeInSeconds =
		secondTime === null
			? null
			: secondTime.hours * 3600 + secondTime.minutes * 60 + secondTime.seconds

	const timeIncrement = route.params.timeIncrement
	const secondTimeIncrement = route.params.secondTimeIncrement

	const clockOrientation = route.params.clockOrientation

	const [topPlayerClock, setTopPlayerClock] = useState(timeInSeconds)
	const [bottomPlayerClock, setBottomPlayerClock] = useState(
		secondTimeInSeconds ? secondTimeInSeconds : timeInSeconds,
	)

	const [isTopPlaying, setIsTopPlaying] = useState(false)
	const [isBottomPlaying, setIsBottomPlaying] = useState(false)
	const [intervalId, setIntervalId] = useState<NodeJS.Timeout>()

	const [topPlayerCount, setTopPlayerCount] = useState<number>(0)
	const [bottomPlayerCount, setBottomPlayerCount] = useState<number>(0)
	const [lastMoveWasTop, setLastMoveWasTop] = useState<boolean>(false)

	function handleStartPause() {
		if (isTopPlaying || isBottomPlaying) {
			stopTopPlayerTimer()
			stopBottomPlayerTimer()
		} else {
			lastMoveWasTop ? startBottomPlayerTimer() : startTopPlayerTimer()
		}
	}

	function restartClock() {
		clearInterval(intervalId)
		setIsTopPlaying(false)
		setIsBottomPlaying(false)

		setTopPlayerClock(timeInSeconds)
		setBottomPlayerClock(secondTimeInSeconds ? secondTimeInSeconds : timeInSeconds)

		setTopPlayerCount(0)
		setBottomPlayerCount(0)
	}

	function playMoveSound() {}

	function handleMove(topPlayerMoved: boolean) {
		if (topPlayerMoved && isTopPlaying) {
			stopTopPlayerTimer()
			startBottomPlayerTimer()

			setTopPlayerClock((prev) => prev + timeIncrement)
			setTopPlayerCount((prev) => prev + 1)
			setLastMoveWasTop(true)
			playMoveSound()
		} else if (!topPlayerMoved && isBottomPlaying) {
			stopBottomPlayerTimer()
			startTopPlayerTimer()

			setBottomPlayerClock((prev) =>
				secondTimeIncrement ? prev + secondTimeIncrement : prev + timeIncrement,
			)
			setBottomPlayerCount((prev) => prev + 1)
			setLastMoveWasTop(false)
			playMoveSound()
		} else if (!isTopPlaying && !isBottomPlaying) {
			topPlayerMoved ? startTopPlayerTimer() : startBottomPlayerTimer()
			playMoveSound()
		}
	}

	function startTopPlayerTimer() {
		if (isTopPlaying || topPlayerClock === 0) return

		setIsTopPlaying(true)
		setTopPlayerClock((prev) => prev - 1)

		const id = setInterval(() => {
			setTopPlayerClock((prev) => {
				if (prev <= 1) {
					clearInterval(id)
					setIsTopPlaying(false)
					return 0
				}
				return prev - 1
			})
		}, 1000)
		setIntervalId(id)
	}

	function stopTopPlayerTimer() {
		clearInterval(intervalId)
		setIsTopPlaying(false)
	}

	function startBottomPlayerTimer() {
		if (isBottomPlaying || bottomPlayerClock === 0) return
		setIsBottomPlaying(true)

		setBottomPlayerClock((prev) => prev - 1)

		const id = setInterval(() => {
			setBottomPlayerClock((prev) => {
				if (prev <= 1) {
					clearInterval(id)
					setIsBottomPlaying(false)
					return 0
				}
				return prev - 1
			})
		}, 1000)
		setIntervalId(id)
	}

	function stopBottomPlayerTimer() {
		clearInterval(intervalId)
		setIsBottomPlaying(false)
	}

	useEffect(() => {
		return () => clearInterval(intervalId)
	}, [intervalId])

	return (
		<View style={styles.container}>
			<PlayerClock
				isTopPlayer
				isPlaying={isTopPlaying}
				onMove={handleMove}
				playerClock={topPlayerClock}
				movesCount={topPlayerCount}
				timeInSeconds={timeInSeconds}
				timeIncrement={timeIncrement}
				clockOrientation={clockOrientation}
			/>

			<View style={[styles.actionsContainer]}>
				<IconButton
					onPress={() => navigation.goBack()}
					iconName="arrow-left"
					iconSize={theme.fontSize.xl}
				/>

				<IconButton
					onPress={handleStartPause}
					iconName={isTopPlaying || isBottomPlaying ? "pause" : "play"}
					iconSize={theme.fontSize.xl}
					style={
						clockOrientation === "Horizontal"
							? { transform: [{ rotate: "90deg" }] }
							: {}
					}
				/>

				<IconButton
					onPress={restartClock}
					iconName="restart"
					iconSize={theme.fontSize.xl}
				/>
			</View>

			<PlayerClock
				isTopPlayer={false}
				isPlaying={isBottomPlaying}
				onMove={handleMove}
				playerClock={bottomPlayerClock}
				movesCount={bottomPlayerCount}
				timeInSeconds={secondTimeInSeconds ? secondTimeInSeconds : timeInSeconds}
				timeIncrement={secondTimeIncrement ? secondTimeIncrement : timeIncrement}
				clockOrientation={clockOrientation}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: theme.colors.backgroundDark,
		flex: 1,
	},
	actionsContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingHorizontal: theme.spacing.l,
		paddingVertical: theme.spacing.xxs,
	},
})
