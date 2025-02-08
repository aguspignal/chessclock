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

	const [isTopPlaying, setIsTopPlaying] = useState(false)
	const [isBottomPlaying, setIsBottomPlaying] = useState(false)
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

			setBottomPlayerClock((prev) => prev + timeIncrement)
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

			<View style={styles.actionsContainer}>
				<IconButton onPress={() => navigation.goBack()} iconName="cancel" />

				<IconButton
					onPress={handleStartPause}
					iconName={isTopPlaying || isBottomPlaying ? "pause" : "play"}
				/>

				<IconButton onPress={restartClock} iconName="restart" />
			</View>

			<PlayerClock
				isTopPlayer={false}
				isPlaying={isBottomPlaying}
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
