import { ClockProps } from "../types/navigation"
import { StyleSheet, View } from "react-native"
import { theme } from "../resources/theme"
import { useAudioPlayer } from "expo-audio"
import { useConfigStore } from "../stores/useConfigStore"
import { useEffect, useRef, useState } from "react"
import { useSecondTimeStore, useTimeStore } from "../stores/useTimeStore"
import IconButton from "../components/IconButton"
import PlayerClock from "../components/PlayerClock"
import { useKeepAwake } from "expo-keep-awake"

const audioSource = require("../../assets/click.mp3")

export default function Clock({ navigation }: ClockProps) {
	const {
		time: { timeIncrementMs },
		timeInMilliseconds,
	} = useTimeStore()
	const {
		secondTime: { timeIncrementMs: secondTimeIncrement },
		secondTimeInMilliseconds,
	} = useSecondTimeStore()
	const { orientation, soundEnabled, withDifferentTimes } = useConfigStore()
	const audioPlayer = useAudioPlayer(audioSource)
	useKeepAwake()

	const intervalId = useRef<ReturnType<typeof setInterval> | undefined>(undefined)
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

	// Which side was running when the clock was paused; null whenever it isn't paused.
	const [pausedPlayerIsTop, setPausedPlayerIsTop] = useState<boolean | null>(
		null,
	)

	// Derived, never stored: a fallen flag ends the game until the clock is restarted.
	const isGameOver = topPlayerClock <= 0 || bottomPlayerClock <= 0
	const isPaused = pausedPlayerIsTop !== null

	function handleStartPause() {
		if (isGameOver) return

		if (isTopPlaying || isBottomPlaying) {
			pauseClock()
		} else {
			resumeClock()
		}
	}

	function pauseClock() {
		stopAllTimers()
		setPausedPlayerIsTop(isTopPlaying)
		setIsTopPlaying(false)
		setIsBottomPlaying(false)
	}

	function resumeClock() {
		if (pausedPlayerIsTop === null) {
			// Nothing to resume — this is the opening move of the game.
			lastMoveWasTop ? startBottomPlayerTimer() : startTopPlayerTimer()
			return
		}

		pausedPlayerIsTop ? startTopPlayerTimer() : startBottomPlayerTimer()
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
		setPausedPlayerIsTop(null)

		setTopPlayerClock(timeInMilliseconds)
		setBottomPlayerClock(
			withDifferentTimes ? secondTimeInMilliseconds : timeInMilliseconds,
		)

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
		if (isGameOver) return

		// While paused a tap resumes the side that was running — it never hands
		// the turn to whichever half happened to be tapped.
		if (isPaused) {
			resumeClock()
			return
		}

		if (topPlayerMoved && isTopPlaying) {
			playMoveSound()
			stopAllTimers()

			setTopPlayerClock((prev) => prev + timeIncrementMs)
			setTopPlayerCount((prev) => prev + 1)
			setLastMoveWasTop(true)

			startBottomPlayerTimer()
		} else if (!topPlayerMoved && isBottomPlaying) {
			playMoveSound()
			stopAllTimers()

			setBottomPlayerClock((prev) =>
				withDifferentTimes
					? prev + secondTimeIncrement
					: prev + timeIncrementMs,
			)
			setBottomPlayerCount((prev) => prev + 1)
			setLastMoveWasTop(false)

			startTopPlayerTimer()
		} else if (!isTopPlaying && !isBottomPlaying) {
			topPlayerMoved ? startTopPlayerTimer() : startBottomPlayerTimer()
		}
	}

	function startTopPlayerTimer() {
		if (isGameOver || isTopPlaying) return

		stopAllTimers()
		setIsTopPlaying(true)
		setIsBottomPlaying(false)
		setPausedPlayerIsTop(null)
		lastUpdateTime.current = Date.now()

		const id = setInterval(() => {
			const now = Date.now()
			const deltaTime = now - lastUpdateTime.current
			lastUpdateTime.current = now

			// Keep the updater pure — reaching 0 is handled by the game-over effect.
			setTopPlayerClock((prev) => Math.max(0, prev - deltaTime))
		}, UPDATE_INTERVAL)

		intervalId.current = id
	}

	function startBottomPlayerTimer() {
		if (isGameOver || isBottomPlaying) return

		stopAllTimers()
		setIsBottomPlaying(true)
		setIsTopPlaying(false)
		setPausedPlayerIsTop(null)
		lastUpdateTime.current = Date.now()

		const id = setInterval(() => {
			const now = Date.now()
			const deltaTime = now - lastUpdateTime.current
			lastUpdateTime.current = now

			// Keep the updater pure — reaching 0 is handled by the game-over effect.
			setBottomPlayerClock((prev) => Math.max(0, prev - deltaTime))
		}, UPDATE_INTERVAL)

		intervalId.current = id
	}

	useEffect(() => {
		if (!isGameOver) return

		stopAllTimers()
		setIsTopPlaying(false)
		setIsBottomPlaying(false)
	}, [isGameOver])

	useEffect(() => {
		return () => stopAllTimers()
	}, [])

	return (
		<View style={styles.container}>
			<PlayerClock
				isTopPlayer
				isGameOver={isGameOver}
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
					iconName={
						isTopPlaying || isBottomPlaying ? "pause" : "play"
					}
					iconSize={theme.fontSize.h2}
					iconColor={
						isGameOver
							? theme.colors.grayDark
							: theme.colors.textLight
					}
					style={
						orientation === "Horizontal" ? styles.rotate90deg : null
					}
				/>

				<IconButton
					onPress={restartClock}
					iconName="restart"
					iconSize={theme.fontSize.h2}
				/>
			</View>

			<PlayerClock
				isTopPlayer={false}
				isGameOver={isGameOver}
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
