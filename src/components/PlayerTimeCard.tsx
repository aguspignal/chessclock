import { parsePresetTimeToText } from "../utils/parsing"
import { Pressable, StyleSheet, Text, View } from "react-native"
import { PresetTime } from "../types/utils"
import { theme } from "../resources/theme"
import { useTranslation } from "react-i18next"
import Icon from "@expo/vector-icons/MaterialCommunityIcons"
import React from "react"

type Props = {
	label: string
	time: PresetTime
	incrementMs: number
	onPress: () => void
	isBlack?: boolean
}

export default function PlayerTimeCard({
	label,
	time,
	incrementMs,
	onPress,
	isBlack = false,
}: Props) {
	const { t } = useTranslation()

	return (
		<Pressable onPress={onPress} style={styles.card}>
			<View style={styles.labelContainer}>
				<View style={[styles.marker, isBlack ? styles.markerBlack : styles.markerWhite]} />
				<Text style={styles.label}>{label}</Text>
			</View>

			<Text style={styles.time}>{parsePresetTimeToText(time)}</Text>

			<Text style={styles.increment}>
				{`+${Math.floor(incrementMs / 1000)}s ${t("increment-short")}`}
			</Text>

			<View style={styles.editContainer}>
				<Icon name="pencil" size={theme.fontSize.s} color={theme.colors.accent} />
				<Text style={styles.editText}>{t("actions.edit")}</Text>
			</View>
		</Pressable>
	)
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: theme.colors.surface,
		borderColor: theme.colors.border,
		borderRadius: theme.spacing.s,
		borderWidth: 1,
		flex: 1,
		padding: theme.spacing.xs,
	},
	labelContainer: {
		alignItems: "center",
		flexDirection: "row",
		gap: theme.spacing.xxs,
	},
	marker: {
		borderRadius: 9,
		height: 18,
		width: 18,
	},
	markerWhite: {
		backgroundColor: theme.colors.textLight,
	},
	markerBlack: {
		backgroundColor: theme.colors.textDark,
		borderColor: theme.colors.grayDark,
		borderWidth: 1,
	},
	label: {
		color: theme.colors.textLight,
		fontSize: theme.fontSize.s,
		fontWeight: "600",
	},
	time: {
		color: theme.colors.textLight,
		fontSize: theme.fontSize.h3,
		fontWeight: "700",
		marginTop: theme.spacing.xxs,
	},
	increment: {
		color: theme.colors.accent,
		fontSize: theme.fontSize.xs,
		fontWeight: "500",
	},
	editContainer: {
		alignItems: "center",
		flexDirection: "row",
		gap: 6,
		marginTop: theme.spacing.s,
	},
	editText: {
		color: theme.colors.textLight,
		fontSize: theme.fontSize.xs,
		fontWeight: "500",
	},
})
