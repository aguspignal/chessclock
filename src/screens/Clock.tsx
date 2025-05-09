import { ClockProps } from "../types/navigation"
import { StyleSheet, View } from "react-native"
import { theme } from "../resources/theme"
import { useAudioPlayer } from "expo-audio"
import { useConfigStore } from "../stores/useConfigStore"
import { useEffect, useState } from "react"
import { useSecondTimeStore, useTimeStore } from "../stores/useTimeStore"
import IconButton from "../components/IconButton"
import PlayerClock from "../components/PlayerClock"

const clickSource = require("../../assets/click.mp3")

export default function Clock({ navigation }: ClockProps) {
	const {
		time: { timeIncrement },
		timeInSeconds,
	} = useTimeStore()
	const {
		secondTime: { timeIncrement: secondTimeIncrement },
		secondTimeInSeconds,
	} = useSecondTimeStore()
	const { orientation, soundEnabled, withDifferentTimes } = useConfigStore()
	const audioPlayer = useAudioPlayer(clickSource)

	const [topPlayerClock, setTopPlayerClock] = useState(timeInSeconds)
	const [bottomPlayerClock, setBottomPlayerClock] = useState(
		withDifferentTimes ? secondTimeInSeconds : timeInSeconds,
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
		setBottomPlayerClock(withDifferentTimes ? secondTimeInSeconds : timeInSeconds)

		setTopPlayerCount(0)
		setBottomPlayerCount(0)
	}

	async function playMoveSound() {
		if (soundEnabled) {
			audioPlayer.play()
			audioPlayer.replace(clickSource)
		}
	}

	function handleMove(topPlayerMoved: boolean) {
		if (topPlayerMoved && isTopPlaying) {
			playMoveSound()
			stopTopPlayerTimer()
			startBottomPlayerTimer()

			setTopPlayerClock((prev) => prev + timeIncrement)
			setTopPlayerCount((prev) => prev + 1)
			setLastMoveWasTop(true)
		} else if (!topPlayerMoved && isBottomPlaying) {
			playMoveSound()
			stopBottomPlayerTimer()
			startTopPlayerTimer()

			setBottomPlayerClock((prev) =>
				withDifferentTimes ? prev + secondTimeIncrement : prev + timeIncrement,
			)
			setBottomPlayerCount((prev) => prev + 1)
			setLastMoveWasTop(false)
		} else if (!isTopPlaying && !isBottomPlaying) {
			topPlayerMoved ? startTopPlayerTimer() : startBottomPlayerTimer()
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
			/>

			<View style={[styles.actionsContainer]}>
				<IconButton
					onPress={() => navigation.goBack()}
					iconName="arrow-left"
					iconSize={theme.fontSize.h2}
				/>

				<IconButton
					onPress={handleStartPause}
					iconName={isTopPlaying || isBottomPlaying ? "pause" : "play"}
					iconSize={theme.fontSize.h2}
					style={orientation === "Horizontal" ? { transform: [{ rotate: "90deg" }] } : {}}
				/>

				<IconButton
					onPress={restartClock}
					iconName="restart"
					iconSize={theme.fontSize.h2}
				/>
			</View>

			<PlayerClock
				isTopPlayer={false}
				isPlaying={isBottomPlaying}
				onMove={handleMove}
				playerClock={bottomPlayerClock}
				movesCount={bottomPlayerCount}
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
