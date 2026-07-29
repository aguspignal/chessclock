import { parsePresetTimeToText, parseStringToNumber } from "../utils/parsing"
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native"
import { PresetTime } from "../types/utils"
import { theme } from "../resources/theme"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import ActionButton from "./ActionButton"
import Card, { CardDivider } from "./Card"
import React from "react"

const MAX_INCREMENT_SECONDS = 59

type Props = {
	time: PresetTime
	incrementMs: number
	onPressTime: () => void
	onChangeIncrementMs: (ms: number) => void
}

export default function TimeCard({ time, incrementMs, onPressTime, onChangeIncrementMs }: Props) {
	const { t } = useTranslation()
	const incrementSeconds = Math.floor(incrementMs / 1000)

	const [incrementInput, setIncrementInput] = useState<string>(String(incrementSeconds))

	// Only pull the store value back into the field when it stops matching what is
	// typed — a preset picked on another screen resyncs, but "05" is not rewritten
	// to "5" and an emptied field is not refilled with a 0 while editing.
	useEffect(() => {
		if (incrementSeconds !== parseStringToNumber(incrementInput)) {
			setIncrementInput(String(incrementSeconds))
		}
	}, [incrementSeconds])

	function handleChangeIncrement(value: string) {
		const seconds = Math.min(parseStringToNumber(value), MAX_INCREMENT_SECONDS)

		setIncrementInput(seconds === MAX_INCREMENT_SECONDS ? String(seconds) : value)
		onChangeIncrementMs(seconds * 1000)
	}

	function handleStepIncrement(step: number) {
		const seconds = Math.min(Math.max(incrementSeconds + step, 0), MAX_INCREMENT_SECONDS)

		setIncrementInput(String(seconds))
		onChangeIncrementMs(seconds * 1000)
	}

	return (
		<Card>
			<Pressable onPress={onPressTime} style={styles.row}>
				<View style={styles.valueContainer}>
					<Text style={styles.label}>{t("time")}</Text>
					<Text style={styles.value}>{parsePresetTimeToText(time)}</Text>
				</View>

				<ActionButton icon="pencil" />
			</Pressable>

			<CardDivider />

			<View style={styles.row}>
				<View style={styles.valueContainer}>
					<Text style={styles.label}>{t("increment")}</Text>
					<View style={styles.incrementContainer}>
						<Text style={styles.value}>+</Text>
						<TextInput
							style={[styles.value, styles.incrementInput]}
							onChangeText={handleChangeIncrement}
							value={incrementInput}
							maxLength={2}
							placeholder="0"
							placeholderTextColor={theme.colors.grayDark}
							keyboardType="numeric"
							selectTextOnFocus
						/>
						<Text style={styles.incrementUnit}>s</Text>
					</View>
				</View>

				<View style={styles.stepBtnsContainer}>
					<ActionButton
						icon="minus"
						onPress={() => handleStepIncrement(-1)}
						disabled={incrementSeconds === 0}
					/>

					<ActionButton
						icon="plus"
						onPress={() => handleStepIncrement(1)}
						disabled={incrementSeconds === MAX_INCREMENT_SECONDS}
					/>
				</View>
			</View>
		</Card>
	)
}

const styles = StyleSheet.create({
	row: {
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "space-between",
		paddingHorizontal: theme.spacing.s,
		paddingVertical: theme.spacing.xs,
	},
	valueContainer: {
		flex: 1,
	},
	label: {
		color: theme.colors.accent,
		fontSize: theme.fontSize.xxs,
		fontWeight: "600",
		letterSpacing: 1,
		textTransform: "uppercase",
	},
	value: {
		color: theme.colors.textLight,
		fontSize: theme.fontSize.h2,
		fontWeight: "700",
	},
	incrementContainer: {
		alignItems: "center",
		flexDirection: "row",
	},
	incrementInput: {
		padding: 0,
		width: theme.spacing.x4l,
	},
	incrementUnit: {
		color: theme.colors.grayDark,
		fontSize: theme.fontSize.l,
		fontWeight: "600",
		// Sits the unit on the baseline of the number instead of centred against it.
		marginBottom: 4,
	},
	stepBtnsContainer: {
		flexDirection: "row",
		gap: theme.spacing.xxs,
	},
})
