import { ClockProps } from "../types/navigation"
import { StyleSheet, View } from "react-native"
import { theme } from "../utils/theme"
import { useEffect, useState } from "react"
import IconButton from "../components/IconButton"
import PlayerClock from "../components/PlayerClock"
import Sound from "react-native-sound"

export default function Clock({ navigation, route }: ClockProps) {
	const time = route.params.time
	const timeInSeconds = time.hours * 3600 + time.minutes * 60 + time.seconds
	const timeIncrement = route.params.timeIncrement
	const clockOrientation = route.params.clockOrientation

	const [topPlayerClock, setTopPlayerClock] = useState(timeInSeconds)
	const [bottomPlayerClock, setBottomPlayerClock] = useState(timeInSeconds)

	const [isTopRunning, setIsTopRunning] = useState(false)
	const [isBottomRunning, setIsBottomRunning] = useState(false)
	const [intervalId, setIntervalId] = useState<NodeJS.Timeout>()

	const [topPlayerCount, setTopPlayerCount] = useState<number>(0)
	const [bottomPlayerCount, setBottomPlayerCount] = useState<number>(0)
	const [lastMoveWasTop, setLastMoveWasTop] = useState<boolean>(false)

	const clickSound = new Sound("click.mp3", Sound.MAIN_BUNDLE, (err) => {
		if (err) {
			console.log(err)
			return
		}
	})

	function handleStartPause() {
		if (isTopRunning || isBottomRunning) {
			stopTopPlayerTimer()
			stopBottomPlayerTimer()
		} else {
			lastMoveWasTop ? startBottomPlayerTimer() : startTopPlayerTimer()
		}
	}

	function restartClock() {
		clearInterval(intervalId)
		setIsTopRunning(false)
		setIsBottomRunning(false)

		setTopPlayerClock(timeInSeconds)
		setBottomPlayerClock(timeInSeconds)

		setTopPlayerCount(0)
		setBottomPlayerCount(0)
	}

	function playMoveSound() {
		if (route.params.isSoundEnabled) {
			clickSound.play((success) => {
				if (!success) {
					console.log("playback failed due to audio decoding errors")
				}
			})
		}
	}

	function handleMove(topPlayerMoved: boolean) {
		if (topPlayerMoved && isTopRunning) {
			stopTopPlayerTimer()
			startBottomPlayerTimer()

			setTopPlayerClock((prev) => prev + timeIncrement)
			setTopPlayerCount((prev) => prev + 1)
			setLastMoveWasTop(true)
			playMoveSound()
		} else if (!topPlayerMoved && isBottomRunning) {
			stopBottomPlayerTimer()
			startTopPlayerTimer()

			setBottomPlayerClock((prev) => prev + timeIncrement)
			setBottomPlayerCount((prev) => prev + 1)
			setLastMoveWasTop(false)
			playMoveSound()
		} else if (!isTopRunning && !isBottomRunning) {
			topPlayerMoved ? startTopPlayerTimer() : startBottomPlayerTimer()
			playMoveSound()
		}
	}

	function startTopPlayerTimer() {
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

	function stopTopPlayerTimer() {
		clearInterval(intervalId)
		setIsTopRunning(false)
	}

	function startBottomPlayerTimer() {
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

	function stopBottomPlayerTimer() {
		clearInterval(intervalId)
		setIsBottomRunning(false)
	}

	useEffect(() => {
		return () => clearInterval(intervalId)
	}, [intervalId])

	return (
		<View style={styles.container}>
			<PlayerClock
				isTopPlayer
				onMove={handleMove}
				playerClock={topPlayerClock}
				movesCount={topPlayerCount}
				timeInSeconds={timeInSeconds}
				timeIncrement={timeIncrement}
				clockOrientation={clockOrientation}
			/>

			<View style={styles.actionsContainer}>
				<IconButton onPress={() => navigation.goBack()} iconName="cancel" />

				<IconButton
					onPress={handleStartPause}
					iconName={isTopRunning || isBottomRunning ? "pause" : "play"}
				/>

				<IconButton onPress={restartClock} iconName="restart" />
			</View>

			<PlayerClock
				isTopPlayer={false}
				onMove={handleMove}
				playerClock={bottomPlayerClock}
				movesCount={bottomPlayerCount}
				timeInSeconds={timeInSeconds}
				timeIncrement={timeIncrement}
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
		paddingHorizontal: theme.spacing.xl,
		paddingVertical: theme.spacing.xs,
	},
})
