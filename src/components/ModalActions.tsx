import { Pressable, StyleSheet, Text, View } from "react-native"
import { theme } from "../resources/theme"
import { useTranslation } from "react-i18next"
import React from "react"

type Props = {
	onCancel: () => void
	onConfirm: () => void
	confirmTitle: string
	isDestructive?: boolean
}

// The cancel / confirm pair every modal ends with.
export default function ModalActions({
	onCancel,
	onConfirm,
	confirmTitle,
	isDestructive = false,
}: Props) {
	const { t } = useTranslation()

	return (
		<View style={styles.container}>
			<Pressable onPress={onCancel} style={[styles.action, styles.cancelAction]}>
				<Text style={styles.cancelText}>{t("actions.cancel")}</Text>
			</Pressable>

			<Pressable
				onPress={onConfirm}
				style={[
					styles.action,
					isDestructive ? styles.destructiveAction : styles.confirmAction,
				]}
			>
				<Text style={isDestructive ? styles.destructiveText : styles.confirmText}>
					{confirmTitle}
				</Text>
			</Pressable>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		gap: theme.spacing.xxs,
		marginTop: theme.spacing.m,
	},
	action: {
		alignItems: "center",
		borderRadius: theme.spacing.xs,
		flex: 1,
		justifyContent: "center",
		paddingVertical: theme.spacing.xxs,
	},
	cancelAction: {
		backgroundColor: theme.colors.surfaceRaised,
	},
	confirmAction: {
		backgroundColor: theme.colors.accent,
	},
	destructiveAction: {
		backgroundColor: theme.colors.red,
	},
	cancelText: {
		color: theme.colors.textLight,
		fontSize: theme.fontSize.s,
		fontWeight: "600",
	},
	confirmText: {
		color: theme.colors.textDark,
		fontSize: theme.fontSize.s,
		fontWeight: "600",
	},
	destructiveText: {
		color: theme.colors.textLight,
		fontSize: theme.fontSize.s,
		fontWeight: "600",
	},
})
