import { StyleSheet, Text, View } from "react-native"
import { theme } from "../resources/theme"
import Icon from "@expo/vector-icons/MaterialCommunityIcons"
import React from "react"

type Props = {
	icon: React.ComponentProps<typeof Icon>["name"]
	label: string
	children: React.ReactNode
}

// A labelled row inside a `Card`: icon, label, and whatever control the setting needs.
export default function SettingRow({ icon, label, children }: Props) {
	return (
		<View style={styles.row}>
			<Icon name={icon} size={theme.fontSize.xxl} color={theme.colors.textLight} />
			<Text style={styles.label}>{label}</Text>
			{children}
		</View>
	)
}

const styles = StyleSheet.create({
	row: {
		alignItems: "center",
		flexDirection: "row",
		minHeight: 56,
		paddingHorizontal: theme.spacing.s,
		paddingVertical: theme.spacing.xxs,
	},
	label: {
		color: theme.colors.textLight,
		flex: 1,
		fontSize: theme.fontSize.m,
		fontWeight: "500",
		marginLeft: theme.spacing.xs,
	},
})
