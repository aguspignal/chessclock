import { ClockProps } from "../types/navigation"
import { StyleSheet, View } from "react-native"
import { theme } from "../resources/theme"
import { useAudioPlayer } from "expo-audio"
import { useConfigStore } from "../stores/useConfigStore"
import { useEffect, useRef, useState } from "react"
import { useSecondTimeStore, useTimeStore } from "../stores/useTimeStore"
import IconButton from "../components/IconButton"
import PlayerClock from "../components/PlayerClock"

const audioSource = require("../../assets/click.mp3")

export default function Clock({ navigation }: ClockProps) {
	const {
		time: { timeIncrement },
		timeInMilliseconds,
	} = useTimeStore()
	const {
		secondTime: { timeIncrement: secondTimeIncrement },
		secondTimeInMilliseconds,
	} = useSecondTimeStore()
	const { orientation, soundEnabled, withDifferentTimes } = useConfigStore()
	const audioPlayer = useAudioPlayer(audioSource)

	const intervalId = useRef<NodeJS.Timeout | undefined>(undefined)
	const lastUpdateTime = useRef<number>(0)
	const UPDATE_INTERVAL = 10

	const [topPlayerClock, setTopPlayerClock] = useState(timeInMilliseconds)
	const [bottomPlayerClock, setBottomPlayerClock] = useState(
		withDifferentTimes ? secondTimeInMilliseconds : timeInMilliseconds,
	)

	const [isTopPlaying, setIsTopPlaying] = useState(false)
	const [isBottomPlaying, setIsBottomPlaying] = useState(false)

	const [topPlayerCount, setTopPlayerCount] = useState<number>(0)
	const [bottomPlayerCount, setBottomPlayerCount] = useState<number>(0)
	const [lastMoveWasTop, setLastMoveWasTop] = useState<boolean>(false)

	function handleStartPause() {
		if (isTopPlaying || isBottomPlaying) {
			stopAllTimers()
		} else {
			lastMoveWasTop ? startBottomPlayerTimer() : startTopPlayerTimer()
		}
	}

	function stopAllTimers() {
		if (intervalId.current) {
			clearInterval(intervalId.current)
			intervalId.current = undefined
		}
	}

	function restartClock() {
		stopAllTimers()
		setIsTopPlaying(false)
		setIsBottomPlaying(false)

		setTopPlayerClock(timeInMilliseconds)
		setBottomPlayerClock(withDifferentTimes ? secondTimeInMilliseconds : timeInMilliseconds)

		setTopPlayerCount(0)
		setBottomPlayerCount(0)
	}

	async function playMoveSound() {
		if (soundEnabled) {
			audioPlayer.seekTo(0)
			audioPlayer.play()
			// audioPlayer.replace(audioSource)
		}
	}

	function handleMove(topPlayerMoved: boolean) {
		if (topPlayerMoved && isTopPlaying) {
			playMoveSound()
			stopAllTimers()

			setTopPlayerClock((prev) => prev + timeIncrement)
			setTopPlayerCount((prev) => prev + 1)
			setLastMoveWasTop(true)

			startBottomPlayerTimer()
		} else if (!topPlayerMoved && isBottomPlaying) {
			playMoveSound()
			stopAllTimers()

			setBottomPlayerClock((prev) =>
				withDifferentTimes ? prev + secondTimeIncrement : prev + timeIncrement,
			)
			setBottomPlayerCount((prev) => prev + 1)
			setLastMoveWasTop(false)

			startTopPlayerTimer()
		} else if (!isTopPlaying && !isBottomPlaying) {
			topPlayerMoved ? startTopPlayerTimer() : startBottomPlayerTimer()
		}
	}

	function startTopPlayerTimer() {
		if (isTopPlaying || topPlayerClock <= 0) return

		stopAllTimers()
		setIsTopPlaying(true)
		setIsBottomPlaying(false)
		lastUpdateTime.current = Date.now()

		const id = setInterval(() => {
			const now = Date.now()
			const deltaTime = now - lastUpdateTime.current
			lastUpdateTime.current = now

			setTopPlayerClock((prev) => {
				const newTime = Math.max(0, prev - deltaTime)

				if (newTime <= 0) {
					stopAllTimers()
					setIsTopPlaying(false)
					return 0
				}
				return newTime
			})
		}, UPDATE_INTERVAL)

		intervalId.current = id
	}

	function startBottomPlayerTimer() {
		if (isBottomPlaying || bottomPlayerClock <= 0) return

		stopAllTimers()
		setIsBottomPlaying(true)
		setIsTopPlaying(false)
		lastUpdateTime.current = Date.now()

		const id = setInterval(() => {
			const now = Date.now()
			const deltaTime = now - lastUpdateTime.current
			lastUpdateTime.current = now

			setBottomPlayerClock((prev) => {
				const newTime = Math.max(0, prev - deltaTime)

				if (newTime <= 0) {
					stopAllTimers()
					setIsBottomPlaying(false)
					return 0
				}
				return newTime
			})
		}, UPDATE_INTERVAL)

		intervalId.current = id
	}

	useEffect(() => {
		return () => stopAllTimers()
	}, [])

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
					style={orientation === "Horizontal" ? styles.rotate90deg : null}
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
	rotate90deg: {
		transform: [{ rotate: "90deg" }],
	},
})
